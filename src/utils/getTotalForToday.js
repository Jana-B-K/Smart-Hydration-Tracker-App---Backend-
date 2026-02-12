import mongoose from 'mongoose';
import WaterLog from '../models/waterLog.model.js';

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid user id');
    err.statusCode = 400;
    throw err;
  }

  return new mongoose.Types.ObjectId(id);
};

const getTotalForToday = async (userId, day) => {
  const data = await WaterLog.aggregate([
    {
      $match: {
        userId: toObjectId(userId),
        day,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);
  return data.length > 0 ? data[0].total : 0;
};

export default getTotalForToday;
