import * as userService from '../services/user.service.js';

export const getUserById = async (req, res, next) => {
    try{
        const id = req.user.id;
        const user = await userService.getUserById(id);
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json(userObj);
    }catch(err){
        next(err);
    }
}

export const updateUser = async (req, res, next) => {
    try{
        const data = req.body;
        const id = req.user?.id;
        const updatedUser = await userService.updateUser(id, data);
        const userObj = updatedUser.toObject();
        delete userObj.password;
        res.status(200).json(userObj);
    }catch(err){
        next(err);
    }
}

export const updateFcmToken = async (req, res, next) => {
    try {
        const id = req.user?.id;
        const { fcmToken } = req.body || {};

        if (!fcmToken || typeof fcmToken !== 'string') {
            const err = new Error('fcmToken is required');
            err.statusCode = 400;
            throw err;
        }

        const updatedUser = await userService.setFcmToken(id, fcmToken);
        const userObj = updatedUser.toObject();
        delete userObj.password;
        res.status(200).json(userObj);
    } catch (err) {
        next(err);
    }
}
