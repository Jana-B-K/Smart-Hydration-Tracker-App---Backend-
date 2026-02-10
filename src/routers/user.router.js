import * as userController from '../controllers/user.controller.js'
import {Router} from 'express';
import validate from '../middleware/validate.js'
import { updateUserValidation } from '../validator/user.validation.js';

const userRouter = Router();

userRouter.get('/profile', 
    userController.getUserById)

userRouter.put(
    '/profile', 
    updateUserValidation,
    validate,
    userController.updateUser
)

export default userRouter;