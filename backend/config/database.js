// config/database.js
import mongoose from "mongoose"; // Import mongoose
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables

const connectDatabase = async () => {
  try {
    const uri = process.env.DB_URI; // Get the entire URI from the environment variable

    if (!uri) {
      throw new Error("Database URI is not defined in the environment variables");
    }

    // Log a message indicating the attempt to connect to the database
    console.log("Attempting to connect to MongoDB...");

    // Connect to the database without deprecated options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Optional: Timeout for selecting a server
    });

    console.log(`MongoDB connected successfully to HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message); // Log the error message without stack trace
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default connectDatabase; // Export the connectDatabase function
