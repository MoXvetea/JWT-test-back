require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://" + process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));