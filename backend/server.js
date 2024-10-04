// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDatabase = require("./config/database");
const productRoutes = require("./routes/prodRoutes");

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
