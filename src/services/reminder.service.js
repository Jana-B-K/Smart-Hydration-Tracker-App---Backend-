import Reminder from '../models/reminder.model.js';

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

export const pauseReminder = async (userId, minutes = 60) => {
  const pauseMinutes = Number(minutes);
  if (!Number.isFinite(pauseMinutes) || pauseMinutes <= 0) {
    const err = new Error('minutes must be a positive number');
    err.statusCode = 400;
    throw err;
  }

  const reminder = await Reminder.findOne({ userId });
  if (!reminder) {
    throw buildNotFoundError('Reminder not found for this user');
  }

  reminder.pausedUntil = new Date(Date.now() + pauseMinutes * 60 * 1000);
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
  if (!reminder || !user) return false;
  if (!reminder.isActive) return false;
  if (reminder.sleepMode) return false;

  if (reminder.pausedUntil && new Date() < reminder.pausedUntil) return false;
  if (!isWithinSchedule(reminder.startTime, reminder.endTime)) return false;

  if (typeof user.dailyGoal === 'number' && todayIntake >= user.dailyGoal) {
    return false;
  }

  if (reminder.lastReminderSent) {
    const diffMinutes = (Date.now() - new Date(reminder.lastReminderSent).getTime()) / (1000 * 60);
    if (diffMinutes < reminder.interval) {
      return false;
    }
  }

  return true;
};
