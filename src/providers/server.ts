import { defaultFeatureFlags, getFeatureFlags } from '@iam-hussain/qd-copilot';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { authRouter } from '@/api/authentication';
import { authTransformer } from '@/api/authentication/transfomer';
import { categoryRouter } from '@/api/category';
import { healthCheckRouter } from '@/api/health-check';
import { itemRouter } from '@/api/item';
import { orderRouter } from '@/api/order';
import { productRouter } from '@/api/product';
import { storeRouter } from '@/api/store';
import { storeRepository } from '@/api/store/repository';
import { userRouter } from '@/api/user';
import jwt from '@/libs/jwt';
import errorHandler from '@/middleware/error-handler';
// import rateLimiter from '@/middleware/rate-limiter';
import requestLogger from '@/middleware/request-logger';
import { env } from '@/providers/env-config';
import { RequestContext } from '@/types';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// parse application/x-www-form-urlencoded
app.use(express.json());

// Request logging
app.use(requestLogger());

app.use(async (req: any, res, next) => {
  let context: RequestContext = {
    tokenExist: false,
    authenticated: false,
    user: {
      id: '',
      shortId: '',
      type: 'CUSTOMER',
    },
    stores: [],
    store: {
      shortId: '',
      slug: '',
      id: '',
    },
    featureFlags: defaultFeatureFlags,
  };
  const token = authTransformer.getToken(req);
  if (token) {
    context = {
      ...context,
      tokenExist: true,
    };
    const decoded = jwt.decode(token);

    if (decoded) {
      context = authTransformer.extractToken(decoded);
      if (context.store.slug) {
        const flags = await storeRepository.findFeatureFlagsBySlug(context.store.slug);
        context.featureFlags = getFeatureFlags(flags);
      }
    }
  }

  req.context = context;

  next();
});

// Routes
app.use('/', healthCheckRouter);
app.use('/api/authentication', authRouter);
app.use('/api/store', storeRouter);
app.use('/api/store', productRouter);
app.use('/api/store', categoryRouter);
app.use('/api/store', orderRouter);
app.use('/api/store', itemRouter);
app.use('/api/user', userRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
