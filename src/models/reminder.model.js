import mongoose from 'mongoose';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      unique: true,
    },
    interval: {
      type: Number,
      required: true,
      min: 1,
    },
    startTime: {
      type: String,
      required: true,
      match: timeRegex,
    },
    endTime: {
      type: String,
      required: true,
      match: timeRegex,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sleepMode: {
      type: Boolean,
      default: false,
    },
    paused: {
      type: Boolean,
      default: false,
    },
    pauseStartTime: {
      type: String,
      default: null,
      match: timeRegex,
    },
    pauseEndTime: {
      type: String,
      default: null,
      match: timeRegex,
    },
    lastReminderSent: {
      type: Date,
      default: null,
    },
    sendingLockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Reminder = mongoose.model('reminder', ReminderSchema);

export default Reminder;
