// config/database.js
import mongoose from "mongoose"; // Import mongoose
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables

const connectDatabase = async () => {
  try {
    const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
    const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

    // Remove deprecated options
    await mongoose.connect(uri);

    console.log(`MongoDB connected with HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error(error); // Ensure the error is thrown to be caught in server.js
  }
};

export default connectDatabase;
