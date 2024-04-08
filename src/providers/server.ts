import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { authRouter } from '@/api/authentication';
import { authTransformer } from '@/api/authentication/transfomer';
import { healthCheckRouter } from '@/api/health-check';
import { userRouter } from '@/api/user';
import jwt from '@/libs/jwt';
import errorHandler from '@/middleware/error-handler';
import rateLimiter from '@/middleware/rate-limiter';
import requestLogger from '@/middleware/request-logger';
import { env } from '@/providers/env-config';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Request logging
app.use(requestLogger());

app.use((req: any, res, next) => {
  const token = authTransformer.getToken(req as unknown as Request);
  if (token) {
    const decoded = jwt.decode(token);
    if (decoded) {
      const payload = authTransformer.extractToken(decoded);

      req.auth = {
        ...payload,
        hasToken: true,
      };
    } else {
      req.auth = {
        hasToken: true,
        isSeller: false,
        hasStore: false,
        storeId: null,
        userId: null,
      };
    }
  } else {
    req.auth = {
      hasToken: false,
      isSeller: false,
      hasStore: false,
      storeId: null,
      userId: null,
    };
  }
  console.log({ auth: req.auth });
  next();
});

// Routes
app.use('/api/authentication', authRouter);
app.use('/api/health-check', healthCheckRouter);
app.use('/api/user', userRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
