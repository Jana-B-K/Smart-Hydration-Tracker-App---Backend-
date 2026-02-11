import mongoose from "mongoose";

const WaterLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1,
        },
        day: {
            type: Date,
            required:true,
        }
    },
    {timestamps: true}
)

const WaterLog = mongoose.model("waterlog", WaterLogSchema);
export default WaterLog;