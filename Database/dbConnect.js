/** @format */
require("dotenv").config();
const { MONGO_URI } = process.env;
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
module.exports = mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB...");
  });
