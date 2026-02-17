import cron from 'node-cron';
import Reminder from '../models/reminder.model.js';
import User from '../models/user.model.js';
import getStartDay from '../utils/date.js';
import getTotalForToday from '../utils/getTotalForToday.js';
import { sendPushNotification } from '../services/fcm.service.js';
import { evaluateReminder } from '../services/reminder.service.js';

const debugReminder = process.env.DEBUG_REMINDER === 'false';

cron.schedule('*/1 * * * *', async () => {
  try {
    if (debugReminder) {
      console.log('[REMINDER_CRON] tick');
    }
    const reminders = await Reminder.find({ isActive: true });

    for (const reminder of reminders) {
      const user = await User.findById(reminder.userId);
      if (!user) {
        if (debugReminder) {
          console.log(`[REMINDER_CRON] skipped reminder=${reminder._id}: user not found`);
        }
        continue;
      }

      const today = getStartDay();
      const totalForToday = await getTotalForToday(user._id, today);
      const { send, reason } = await evaluateReminder(reminder, user, totalForToday);

      if (!send) {
        if (debugReminder) {
          console.log(`[REMINDER_CRON] skipped reminder=${reminder._id}: ${reason}`);
        }
        continue;
      }
      // Acquire a short lock so multiple app instances cannot send duplicate reminders.
      const now = new Date();
      const lockUntil = new Date(now.getTime() + 55 * 1000);
      const claim = await Reminder.findOneAndUpdate(
        {
          _id: reminder._id,
          $or: [
            { sendingLockUntil: null },
            { sendingLockUntil: { $lte: now } },
          ],
        },
        {
          $set: { sendingLockUntil: lockUntil },
        },
        { returnDocument: 'after' }
      );

      if (!claim) {
        if (debugReminder) {
          console.log(`[REMINDER_CRON] skipped reminder=${reminder._id}: lock held by another worker`);
        }
        continue;
      }

      const delivered = await sendPushNotification(user.name, user.fcmToken);
      if (!delivered) {
        await Reminder.updateOne(
          { _id: reminder._id },
          { $set: { sendingLockUntil: null } }
        );
        if (debugReminder) {
          console.log(`[REMINDER_CRON] delivery failed reminder=${reminder._id}`);
        }
        continue;
      }

      reminder.lastReminderSent = new Date();
      reminder.sendingLockUntil = null;
      await reminder.save();
      if (debugReminder) {
        console.log(`[REMINDER_CRON] delivered reminder=${reminder._id}`);
      }
    }
  } catch (err) {
    console.error('Reminder cron failed:', err.message);
  }
});
