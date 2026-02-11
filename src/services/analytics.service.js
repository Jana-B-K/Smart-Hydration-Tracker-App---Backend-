import mongoose from 'mongoose';
import WaterLog from '../models/waterLog.model.js';
import getStartDay from '../utils/date.js';
import getTotalForToday from '../utils/getTotalForToday.js';

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid user id');
    err.statusCode = 400;
    throw err;
  }

  return new mongoose.Types.ObjectId(id);
};

const previousDay = (date) => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - 1);
  return d;
};

/**
 * WEEKLY ANALYTICS (Calendar Week)
 * Default: Sunday → Saturday (UTC)
 * 
 * To switch to Monday-start week:
 * Replace:
 *   const dayOfWeek = today.getUTCDay();
 * With:
 *   const dayOfWeek = (today.getUTCDay() + 6) % 7;
 */
export const getWeeklyData = async (id) => {
  const userId = toObjectId(id);

  const today = getStartDay(); // already UTC midnight
  const dayOfWeek = today.getUTCDay(); // 0 (Sun) - 6 (Sat)

  const startOfWeek = new Date(today);
  startOfWeek.setUTCDate(today.getUTCDate() - dayOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

  const data = await WaterLog.aggregate([
    {
      $match: {
        userId,
        day: { $gte: startOfWeek, $lte: endOfWeek },
      },
    },
    {
      $group: {
        _id: '$day',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return data;
};

/**
 * MONTHLY ANALYTICS (Calendar Month)
 * From day 1 → last day of current month (UTC)
 */
export const getMonthlyAnalytics = async (id) => {
  const userId = toObjectId(id);

  const today = getStartDay();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();

  // First day of current month (UTC)
  const startOfMonth = new Date(Date.UTC(year, month, 1));

  // Last day of current month (UTC)
  // month + 1, day 0 → last day of current month
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0));

  const data = await WaterLog.aggregate([
    {
      $match: {
        userId,
        day: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: '$day',
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return data;
};

export const streakCalculation = async (userId, goal) => {
  let streak = 0;
  let currentDay = getStartDay();

  while (true) {
    const total = await getTotalForToday(userId, currentDay);

    if (total >= goal) {
      streak += 1;
      currentDay = previousDay(currentDay);
    } else {
      break;
    }
  }

  return streak;
};

export const calculateHydrationScore = async (userId, dailyGoal) => {
  const today = getStartDay();
  const todayTotal = await getTotalForToday(userId, today);

  const percentage = (todayTotal / dailyGoal) * 100;

  let score = 0;
  if (percentage >= 100) score = 100;
  else if (percentage >= 80) score = 80;
  else if (percentage >= 50) score = 50;

  return {
    todayTotal,
    dailyGoal,
    percentage,
    score,
  };
};
