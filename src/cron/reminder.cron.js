import cron from 'node-cron';
import Reminder from '../models/reminder.model.js';
import User from '../models/user.model.js';
import getStartDay from '../utils/date.js';
import getTotalForToday from '../utils/getTotalForToday.js';
import { sendPushNotification } from '../services/fcm.service.js';
import { shouldSendReminder } from '../services/reminder.service.js';

cron.schedule('*/1 * * * *', async () => {
  try {
    const reminders = await Reminder.find({ isActive: true });

    for (const reminder of reminders) {
      const user = await User.findById(reminder.userId);
      if (!user) {
        continue;
      }

      const today = getStartDay();
      const totalForToday = await getTotalForToday(user._id, today);
      const send = await shouldSendReminder(reminder, user, totalForToday);

      if (!send) {
        continue;
      }

      const delivered = await sendPushNotification(user.fcmToken);
      if (!delivered) {
        continue;
      }

      reminder.lastReminderSent = new Date();
      await reminder.save();
    }
  } catch (err) {
    console.error('Reminder cron failed:', err.message);
  }
});
