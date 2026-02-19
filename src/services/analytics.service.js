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

const toDayKey = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

const getMonthRange = (date = new Date()) => {
  const d = getStartDay(date);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0));
  return { start, end };
};

const getPreviousMonthRange = (date = new Date()) => {
  const d = getStartDay(date);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));
  return { start, end };
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

  const { start: startOfMonth, end: endOfMonth } = getMonthRange();

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

export const getHistoryByDate = async (id, dateInput) => {
  const userId = toObjectId(id);

  if (!dateInput) {
    const err = new Error('date query is required (YYYY-MM-DD)');
    err.statusCode = 400;
    throw err;
  }

  const parsedDate = new Date(dateInput);
  if (Number.isNaN(parsedDate.getTime())) {
    const err = new Error('Invalid date format. Use YYYY-MM-DD');
    err.statusCode = 400;
    throw err;
  }

  const dayStart = getStartDay(parsedDate);

  const logs = await WaterLog.find({
    userId,
    day: dayStart,
  })
    .sort({ createdAt: 1 })
    .lean();

  const total = logs.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return {
    day: toDayKey(dayStart),
    total,
    logs,
  };
};
  

export const getDailyHistory = async (id, days = 7) => {
  const userId = toObjectId(id);
  const rangeDays = Number(days);
  const safeDays = Number.isFinite(rangeDays) && rangeDays > 0 ? rangeDays : 7;

  const end = getStartDay();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - (safeDays - 1));

  const data = await WaterLog.aggregate([
    {
      $match: {
        userId,
        day: { $gte: start, $lte: end },
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

  const byDay = new Map(data.map((item) => [toDayKey(item._id), item.total]));
  const history = [];

  for (let i = 0; i < safeDays; i += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    const key = toDayKey(day);
    history.push({ day: key, total: byDay.get(key) ?? 0 });
  }

  return history;
};

export const getWeeklyPerformance = async (id, dailyGoal = 0) => {
  const userId = toObjectId(id);
  const today = getStartDay();
  const dayOfWeek = today.getUTCDay();

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
  ]);

  const goal = Number(dailyGoal) || 0;
  const totalDays = 7;
  let daysMet = 0;
  let totalIntake = 0;

  for (const entry of data) {
    totalIntake += entry.total;
    if (goal > 0 && entry.total >= goal) {
      daysMet += 1;
    }
  }

  const expectedTotal = goal * totalDays;
  const percentOfGoal = expectedTotal > 0 ? Math.round((totalIntake / expectedTotal) * 100) : 0;
  const percentDaysMet = totalDays > 0 ? Math.round((daysMet / totalDays) * 100) : 0;

  return {
    totalIntake,
    expectedTotal,
    daysMet,
    totalDays,
    percentOfGoal,
    percentDaysMet,
  };
};

export const getMonthlyComparison = async (id) => {
  const userId = toObjectId(id);
  const { start: currentStart, end: currentEnd } = getMonthRange();
  const { start: prevStart, end: prevEnd } = getPreviousMonthRange();

  const [currentAgg, prevAgg] = await Promise.all([
    WaterLog.aggregate([
      { $match: { userId, day: { $gte: currentStart, $lte: currentEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    WaterLog.aggregate([
      { $match: { userId, day: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const currentTotal = currentAgg.length ? currentAgg[0].total : 0;
  const previousTotal = prevAgg.length ? prevAgg[0].total : 0;
  const delta = currentTotal - previousTotal;
  const percentChange = previousTotal > 0 ? Math.round((delta / previousTotal) * 100) : 0;

  return {
    currentTotal,
    previousTotal,
    delta,
    percentChange,
  };
};

export const getStreakBadge = (streak) => {
  if (streak >= 30) return 'Platinum';
  if (streak >= 14) return 'Gold';
  if (streak >= 7) return 'Silver';
  if (streak >= 3) return 'Bronze';
  return 'Starter';
};

export const getExportReport = async (id, start, end) => {
  const userId = toObjectId(id);
  const startDate = start ? getStartDay(new Date(start)) : getStartDay();
  const endDate = end ? getStartDay(new Date(end)) : getStartDay();

  const data = await WaterLog.aggregate([
    {
      $match: {
        userId,
        day: { $gte: startDate, $lte: endDate },
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

  const byDay = new Map(data.map((item) => [toDayKey(item._id), item.total]));
  const report = [];

  let current = new Date(startDate);
  while (current <= endDate) {
    const key = toDayKey(current);
    report.push({ day: key, total: byDay.get(key) ?? 0 });
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return report;
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
