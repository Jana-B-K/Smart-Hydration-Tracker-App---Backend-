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

export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await analyticsService.getMonthlyAnalytics(userId);
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
