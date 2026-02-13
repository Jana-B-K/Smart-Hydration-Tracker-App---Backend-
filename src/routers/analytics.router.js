import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';

const analyticsRouter = Router();

analyticsRouter.get('/weekly', analyticsController.getWeeklyData);
analyticsRouter.get('/daily-history', analyticsController.getDailyHistory);
analyticsRouter.get('/weekly-performance', analyticsController.getWeeklyPerformance);
analyticsRouter.get('/monthly', analyticsController.getMonthlyAnalytics);
analyticsRouter.get('/monthly-comparison', analyticsController.getMonthlyComparison);
analyticsRouter.get('/streak', analyticsController.streakCalculation);
analyticsRouter.get('/streak-badge', analyticsController.getStreakBadge);
analyticsRouter.get('/hydration', analyticsController.calculateHydrationScore);
analyticsRouter.get('/export', analyticsController.exportReport);

export default analyticsRouter;
