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
import './cron/reminder.cron.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:8081',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/water', authMiddleware, waterLogRouter);
app.use('/analytics', authMiddleware, analyticsRouter);
app.use('/reminder', authMiddleware, reminderRouter);

app.use(errorHandler);

export default app;
