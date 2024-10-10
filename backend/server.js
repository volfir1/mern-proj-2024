// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDatabase from "./config/database.js";
import productRoutes from "./routes/prodRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Goodmorning");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
