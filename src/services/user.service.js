import Users from '../models/user.model.js'

export const getUserById = async (id) => {
    const user = await Users.findById(id);
    if(!user) throw new Error("User not find");
    return user;
}

export const updateUser = async (id, data) => {
    const updateduser = await Users.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    return updateduser;
}
