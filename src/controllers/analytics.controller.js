import Users from '../models/user.model.js';
import * as analyticsService from '../services/analytics.service.js';

export const getWeeklyData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getWeeklyData(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDailyHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const days = req.query.days;
    const result = await analyticsService.getDailyHistory(userId, days);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getWeeklyPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user?.dailyGoal ?? 0;
    const result = await analyticsService.getWeeklyPerformance(userId, goal);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getMonthlyAnalytics(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMonthlyComparison = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getMonthlyComparison(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const streakCalculation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user.dailyGoal
    
    const result = await analyticsService.streakCalculation(userId, goal);
    res.status(200).json({ streak: result });
  } catch (err) {
    next(err);
  }
};

export const getStreakBadge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId);
    const goal = user?.dailyGoal ?? 0;
    const streak = await analyticsService.streakCalculation(userId, goal);
    const badge = analyticsService.getStreakBadge(streak);
    res.status(200).json({ streak, badge });
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { start, end, format } = req.query;

    if (format === 'pdf') {
      const err = new Error('PDF export not enabled on this server');
      err.statusCode = 501;
      throw err;
    }

    const report = await analyticsService.getExportReport(userId, start, end);
    res.status(200).json({ report, format: 'json' });
  } catch (err) {
    next(err);
  }
};

export const calculateHydrationScore = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const user = await Users.findById(userId);
    const goal = user.dailyGoal
    const result = await analyticsService.calculateHydrationScore(userId, goal);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
