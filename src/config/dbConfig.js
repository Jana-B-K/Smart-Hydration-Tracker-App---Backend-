import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (err) {
    console.error('MongoDB connection failed');
    process.exit(1); // critical: stop app
  }
};

export default connectDB;
