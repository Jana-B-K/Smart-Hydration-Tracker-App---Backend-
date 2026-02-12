import Users from '../models/user.model.js'

export const getUserById = async (id) => {
    const user = await Users.findById(id);
    if(!user) throw new Error("User not find");
    return user;
}

export const updateUser = async (id, data) => {
    const updateduser = await Users.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
    });
    return updateduser;
}

export const setFcmToken = async (id, fcmToken) => {
    const updatedUser = await Users.findByIdAndUpdate(
        id,
        { fcmToken },
        { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    return updatedUser;
}
