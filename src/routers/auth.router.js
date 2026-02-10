import * as authController from '../controllers/auth.controller.js';
import { Router } from 'express';
import validate from '../middleware/validate.js'
import {registerValidation} from '../validator/user.validation.js'
const authRouter = Router();

authRouter.post('/register', 
    registerValidation,
    validate,
    authController.createUser 
)

authRouter.post(
    '/login',
    authController.loginUser
);

authRouter.post(
    '/refresh',
    authController.refreshAccessToken
);

authRouter.post(
    '/logout',
    authController.logoutUser
);


export default authRouter;
