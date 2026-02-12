import * as reminderService from '../services/reminder.service.js';

export const addReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const reminder = await reminderService.addReminder({ ...data, userId });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    const updatedReminder = await reminderService.updateReminder(userId, data);
    res.status(200).json(updatedReminder);
  } catch (err) {
    next(err);
  }
};

export const getReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reminder = await reminderService.getReminder(userId);
    res.status(200).json(reminder);
  } catch (err) {
    next(err);
  }
};

export const pauseReminder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { minutes } = req.body;
    const reminder = await reminderService.pauseReminder(userId, minutes);
    res.status(200).json(reminder);
  } catch (err) {
    next(err);
  }
};

export const toggleSleepMode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reminder = await reminderService.toggleSleepMode(userId);
    res.status(200).json(reminder);
  } catch (err) {
    next(err);
  }
};
