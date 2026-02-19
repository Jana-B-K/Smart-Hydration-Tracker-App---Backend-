import Reminder from '../models/reminder.model.js';
import User from '../models/user.model.js';
import { getUserTypeConfig } from '../utils/profileAdjustments.js';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidTimeString(value) {
  return typeof value === 'string' && TIME_REGEX.test(value);
}

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

export const pauseReminder = async (userId, data) => {
  const { pauseStartTime, pauseEndTime } = data;

  const reminder = await Reminder.findOne({ userId });
  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  const clearPauseWindow =
    pauseStartTime == null &&
    pauseEndTime == null;

  if (clearPauseWindow) {
    reminder.paused = false;
    reminder.pauseStartTime = null;
    reminder.pauseEndTime = null;
    await reminder.save();
    return reminder;
  }

  if (!isValidTimeString(pauseStartTime) || !isValidTimeString(pauseEndTime)) {
    const err = new Error('pauseStartTime and pauseEndTime must be in HH:mm format');
    err.statusCode = 400;
    throw err;
  }

  reminder.paused = false;
  reminder.pauseStartTime = pauseStartTime;
  reminder.pauseEndTime = pauseEndTime;
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

  const hasPauseWindow = Boolean(reminder.pauseStartTime && reminder.pauseEndTime);
  if (hasPauseWindow && isWithinSchedule(reminder.pauseStartTime, reminder.pauseEndTime)) {
    return { send: false, reason: "Reminder is paused" };
  }

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
