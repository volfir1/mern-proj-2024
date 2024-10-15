import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan"; // For request logging
import connectDatabase from "./config/database.js";
import productRoutes from "./routes/prodRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subCategoryRoutes.js"; // Import subcategory routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB with error handling
connectDatabase()
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the server if DB connection fails
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Limit body size for performance & security
app.use(express.urlencoded({ extended: true }));

// Enable request logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api", productRoutes); // Versioning for future flexibility
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes); // Separate subcategories route

// Root route
app.get("/", (req, res) => {
  res.send("Good morning! Server is running.");
});

// 404 handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(
    `Server running on port ${port} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});
