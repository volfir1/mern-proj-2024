const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = () => {
  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri)
    .then((con) => {
      console.log(`MongoDB connected with HOST`);
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};

module.exports = connectDatabase;
