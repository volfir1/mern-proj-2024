import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import morgan from "morgan";
import connectDatabase from "./config/database.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import subcategoryRoutes from "./routes/subcategory.js";
import supplierRoutes from "./routes/supplier.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; // Add this for handling cookies

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: `${__dirname}/.env` });

const app = express();  
const port = process.env.PORT 
// Middleware
// 1. Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser

// 2. CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// 3. Request size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database Connection
connectDatabase()
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Routes
// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Auth Routes (should come before protected routes)
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/categories", subcategoryRoutes); 
app.use("/api/supplier", supplierRoutes);

// Error Handling Middleware
// 1. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// 2. Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const server = app.listen(port, () => {
  console.log(
    `Server running on port ${port} in ${process.env.NODE_ENV || "development"} mode`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;