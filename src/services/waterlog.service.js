import WaterLog from '../models/waterLog.model.js';

export const addWaterIntake = async (data) => {
  const res = await WaterLog.create(data);
  return res;
};

export const updateWaterIntake = async (query, data) => {
  const res = await WaterLog.findOneAndUpdate(query, data, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!res) {
    const err = new Error('Log not found');
    err.statusCode = 404;
    throw err;
  }

  return res;
};

export const deleteWaterIntake = async (query) => {
  const res = await WaterLog.findOneAndDelete(query);

  if (!res) {
    const err = new Error('Log not found to delete');
    err.statusCode = 404;
    throw err;
  }

  return res;
};

export const getDailySummary = async (userId, day) => {
  const logs = await WaterLog.find({ userId, day }).sort({ createdAt: -1 });
  const total = logs.reduce((sum, log) => sum + log.amount, 0);

  return { total, logs };
};
