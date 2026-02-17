import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './middleware/errors.middleware.js';
import authMiddleware from './middleware/authentication.middleware.js';
import authRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';
import waterLogRouter from './routers/waterlog.router.js';
import analyticsRouter from './routers/analytics.router.js';
import reminderRouter from './routers/reminder.router.js';
import { setupSwagger } from './swagger.js';
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowAllOrigins =
  process.env.CORS_ALLOW_ALL === 'true' || allowedOrigins.length === 0;

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests from mobile clients/Postman may not include Origin.
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const err = new Error(`CORS blocked for origin: ${origin}`);
      err.statusCode = 403;
      callback(err);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/water', authMiddleware, waterLogRouter);
app.use('/analytics', authMiddleware, analyticsRouter);
app.use('/reminder', authMiddleware, reminderRouter);

app.use(errorHandler);

export default app;
