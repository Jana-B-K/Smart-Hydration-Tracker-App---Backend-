import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    }
)

const RefreshToken = mongoose.model("refreshTokens", refreshTokenSchema);

export default RefreshToken;