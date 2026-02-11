import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../middleware/helper.js';
import Users from '../models/user.model.js';

function calculateDailyWaterIntake(data){
    
    let { weight, gender, activity, climate, pregnancy } = data;

    // 1. Base water (liters)
    let water = weight * 0.033;

    // 2. Activity adjustment
    const activityMap = {
      low: 0,
      moderate: 0.5,
      high: 1.0
    };
    water += activityMap[activity] ?? 0;

    // 3. Climate adjustment
    const climateMap = {
      cold: 0,
      moderate: 0.3,
      hot: 0.7
    };
    water += climateMap[climate] ?? 0;

    // 4. Pregnancy adjustment
    if (pregnancy === true && gender === "female") {
      water += 0.7;
    }

    // 5. Gender adjustment (small, optional)
    if (gender === "male") {
      water += 0.2;
    }

    // Safety cap (reasonable upper bound)
    if (water > 6) water = 6;

    return Number(water.toFixed(2))*1000; // liters/day
}


export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '60m' }
  );
};

export const generateRefreshToken = (user) => {
      return jwt.sign(
    { id: user._id},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

export const createUser = async (data) => {
  try {
    data.dailyGoal = calculateDailyWaterIntake(data);
    data.password = await hashPassword(data.password);

    const newUser = await Users.create(data);

    const userObj = newUser.toObject();
    delete userObj.password;

    return userObj;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Email already registered");
    }
    throw err;
  }
};



export const loginUser = async (data) => {
  const user = await Users.findOne({ email: data.email })
  if (!user) throw new Error("User not registered");

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error("Password not matched");

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
