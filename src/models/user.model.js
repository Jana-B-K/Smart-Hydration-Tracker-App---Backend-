import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "others"],
            default: "male",
        },
        weight: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        activity: {
            type: String,
            required: true,
            enum: ["low", "high", "moderate"],
            dafault: "moderate",
        },
        climate: {
            type: String,
            required: true,
            enum: ["cold", "hot", "moderate"],
            dafault: "moderate",
        },
        userType: {
            type: String,
            required:true,
            enum: ["Athlete", "Office worker", "Outdoor worker", "Pregnant", "Senior citizen"],
        },
        dailyGoal: {
            type: Number,
        },
        unit: {
            type: String,
            enum: ["ml", "oz"],
            default: "ml",
        },
        fcmToken: {
            type: String,
        }

    }
)

const Users = mongoose.model("users", UserSchema);

export default Users;
