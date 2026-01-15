import mongoose from "mongoose";

const MONGODB_URI = process.env.mongo_url;
const RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 3000; // 3 seconds

if (!MONGODB_URI) {
  console.error("✗ Error: mongo_url environment variable is not defined");
  process.exit(1);
}

export const connectDB = async (attempt = 1) => {
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    
    console.log("✓ MongoDB connected successfully");
    
    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠ MongoDB disconnected");
    });
    
    mongoose.connection.on("error", (error) => {
      console.error("✗ MongoDB connection error:", error.message);
    });
    
    return connection;
  } catch (error) {
    console.error(`✗ MongoDB connection attempt ${attempt} failed:`, error.message);
    
    if (attempt < RETRY_ATTEMPTS) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(attempt + 1);
    } else {
      console.error(`✗ Failed to connect to MongoDB after ${RETRY_ATTEMPTS} attempts`);
      process.exit(1);
    }
  }
};