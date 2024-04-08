import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/health-check';
import { userRouter } from '@/api/user';
import errorHandler from '@/common/middleware/error-handler';
import rateLimiter from '@/common/middleware/rate-limiter';
import requestLogger from '@/common/middleware/request-logger';
import { env } from '@/common/utils/env-config';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger());

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/user', userRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
