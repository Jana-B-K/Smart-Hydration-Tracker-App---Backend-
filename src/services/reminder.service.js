import Reminder from '../models/reminder.model.js';
import User from '../models/user.model.js';
import { getUserTypeConfig } from '../utils/profileAdjustments.js';

function timeToMinutes(timeStr) {
  const [h, m] = String(timeStr).split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return null;
  }
  return h * 60 + m;
}

function isWithinSchedule(startTime, endTime, now = new Date()) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === null || end === null) {
    return false;
  }

  const current = now.getHours() * 60 + now.getMinutes();

  if (start <= end) {
    return current >= start && current <= end;
  }

  return current >= start || current <= end;
}

function buildNotFoundError(message) {
  const err = new Error(message);
  err.statusCode = 404;
  return err;
}

export const addReminder = async (data) => {
  if (data.interval == null) {
    const user = await User.findById(data.userId).select('userType');
    const { reminderInterval } = getUserTypeConfig(user?.userType);
    data.interval = reminderInterval;
  }

  const reminder = await Reminder.findOneAndUpdate(
    { userId: data.userId },
    data,
    {
      returnDocument: 'after',
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return reminder;
};

export const updateReminder = async (userId, data) => {
  const reminder = await Reminder.findOneAndUpdate({ userId }, data, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  return reminder;
};

export const getReminder = async (userId) => {
  const reminder = await Reminder.findOne({ userId });

  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  return reminder;
};

export const pauseReminder = async (userId, paused = false) => {
  if (typeof paused !== 'boolean') {
    const err = new Error('paused must be boolean');
    err.statusCode = 400;
    throw err;
  }

  const reminder = await Reminder.findOne({ userId });
  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  reminder.paused = paused;
  await reminder.save();
  return reminder;
};

export const toggleSleepMode = async (userId) => {
  const reminder = await Reminder.findOne({ userId });
  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  reminder.sleepMode = !reminder.sleepMode;
  await reminder.save();
  return reminder;
};

export const shouldSendReminder = (reminder, user, todayIntake = 0) => {
  const result = evaluateReminder(reminder, user, todayIntake);
  return result.send;
};

export const evaluateReminder = (reminder, user, todayIntake = 0) => {
  // Basic validations
  if (!reminder || !user)   return { send: false, reason: "Missing reminder or user" };
  

  if (!reminder.isActive)  return { send: false, reason: "Reminder is inactive" };
  
  if (reminder.sleepMode)  return { send: false, reason: "Sleep mode enabled" };

  if (reminder.paused)  return { send: false, reason: "Reminder is paused" };

  // Schedule check
  const insideSchedule = isWithinSchedule(
    reminder.startTime,
    reminder.endTime
  );

  if (!insideSchedule)  return { send: false, reason: "Outside schedule window" };

  // Daily goal check
  const dailyGoal = Number(user.dailyGoal);

  if (
    Number.isFinite(dailyGoal) &&
    dailyGoal > 0 &&
    todayIntake >= dailyGoal
  ) {
    return {
      send: false,
      reason: `Daily goal reached (${todayIntake}/${dailyGoal})`,
    };
  }

  // Interval check
  const intervalMinutes = Number(reminder.interval);

  if (
    reminder.lastReminderSent &&
    Number.isFinite(intervalMinutes) &&
    intervalMinutes > 0
  ) {
    const lastSentTime = new Date(reminder.lastReminderSent).getTime();
    const minutesPassed = (Date.now() - lastSentTime) / (1000 * 60);

    if (minutesPassed < intervalMinutes) {
      return { send: false, reason: "Interval not reached yet" };
    }
  }

  // If all checks pass
  return { send: true, reason: null };
};
