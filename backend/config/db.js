// backend/config/db.js
import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the server if DB connection fails
  }
};

// Log unexpected disconnects (useful during dev when Atlas drops idle connections)
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

export default connectDB;