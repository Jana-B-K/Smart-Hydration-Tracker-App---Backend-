import { Router } from 'express';
import * as waterlogController from '../controllers/waterlog.controller.js';

const waterLogRouter = Router();

waterLogRouter.post('/add', waterlogController.addWater);
waterLogRouter.put('/:id', waterlogController.updateWater);
waterLogRouter.get('/daily', waterlogController.getDailySummary);
waterLogRouter.delete('/:id', waterlogController.deleteWaterIntake);

export default waterLogRouter;
