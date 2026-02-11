import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';

const analyticsRouter = Router();

analyticsRouter.get('/weekly', analyticsController.getWeeklyData);
analyticsRouter.get('/monthly', analyticsController.getMonthlyAnalytics);
analyticsRouter.get('/streak', analyticsController.streakCalculation);
analyticsRouter.get('/hydration', analyticsController.calculateHydrationScore);

export default analyticsRouter;
