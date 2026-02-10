import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errors.middleware.js';
import authRouter from './routers/auth.router.js';
import cors from "cors"
import authMiddleware from '../src/middleware/authentication.middleware.js';
import userRouter from './routers/user.router.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json())
app.use('/api/auth', authRouter);
app.use(
    '/user',
    authMiddleware,
    userRouter
)

app.use(errorHandler);

export default app;
