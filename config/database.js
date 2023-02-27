require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://" + process.env.DB_URI)
  .then(() => console.info("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));