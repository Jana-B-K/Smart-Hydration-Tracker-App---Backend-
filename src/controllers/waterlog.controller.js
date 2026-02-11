import getStartDay from '../utils/date.js';
import * as waterlogService from '../services/waterlog.service.js';

export const addWater = async (req, res, next) => {
  const day = getStartDay();
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    const result = await waterlogService.addWaterIntake({ userId, amount, day });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateWater = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    const result = await waterlogService.updateWaterIntake({ _id: id, userId }, { amount });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteWaterIntake = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await waterlogService.deleteWaterIntake({ _id: id, userId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getDailySummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const day = getStartDay();
    const result = await waterlogService.getDailySummary(userId, day);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
