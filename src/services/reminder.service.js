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

export const shouldSendReminder = async (reminder, user, todayIntake = 0) => {
  console.log("should send reminder")
  const { send } = await evaluateReminder(reminder, user, todayIntake);
  return send;
};

export const evaluateReminder = async (reminder, user, todayIntake = 0) => {
  if (!reminder || !user) {
    return { send: false, reason: 'missing reminder or user' };
  }
  if (!reminder.isActive) {
    return { send: false, reason: 'reminder inactive' };
  }
  if (reminder.sleepMode) {
    return { send: false, reason: 'sleep mode enabled' };
  }
  if (reminder.paused) {
    return { send: false, reason: 'reminder paused' };
  }
  if (!isWithinSchedule(reminder.startTime, reminder.endTime)) {
    return { send: false, reason: 'outside schedule window' };
  }

  const dailyGoal = Number(user.dailyGoal);
  if (Number.isFinite(dailyGoal) && dailyGoal > 0 && todayIntake >= dailyGoal) {
    return {
      send: false,
      reason: `daily goal reached (${todayIntake}/${dailyGoal})`,
    };
  }

  if (reminder.lastReminderSent) {
    const diffMinutes = (Date.now() - new Date(reminder.lastReminderSent).getTime()) / (1000 * 60);
    if (diffMinutes < reminder.interval) {
      return { send: false, reason: 'interval not reached yet' };
    }
  }

  return { send: true, reason: null };
};
