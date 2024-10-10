import mongoose from "mongoose"; // Import mongoose
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables

const connectDatabase = () => {
  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri)
    .then((con) => {
      console.log(`MongoDB connected with HOST: ${con.connection.host}`); // Added host for clarity
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};

export default connectDatabase; // Use ES6 export
