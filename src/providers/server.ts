import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { authRouter } from '@/api/authentication';
import { healthCheckRouter } from '@/api/health-check';
import { userRouter } from '@/api/user';
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

app.use((req, res, next) => {
  console.log({ body: req.body });
  next();
});

// Routes
app.use('/api/authentication', authRouter);
app.use('/api/health-check', healthCheckRouter);
app.use('/api/user', userRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
