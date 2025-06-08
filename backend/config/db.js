
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); //stored mongoDB URL in a .env due to safety precautions

        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error); //log error message
        console.error(error.stack); //log error stack

        process.exit(1); //Exit with failure
    }
};

export default connectDB;