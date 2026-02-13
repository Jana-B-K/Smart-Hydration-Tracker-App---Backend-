import { Router } from 'express';
import * as reminderController from '../controllers/reminder.controller.js';

const reminderRouter = Router();

reminderRouter.post('/', reminderController.addReminder);
reminderRouter.put('/update', reminderController.updateReminder);
reminderRouter.get('/', reminderController.getReminder);
reminderRouter.put('/pause', reminderController.pauseReminder);
reminderRouter.put('/toggle-sleep-mode', reminderController.toggleSleepMode);

export default reminderRouter;
