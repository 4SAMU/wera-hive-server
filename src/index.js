/** @format */
require("dotenv").config();
const { PORT } = process.env;

//conection to database
require("../Database/dbConnect");

const express = require("express");
const cors = require("cors");

const authentication = require("./Routes/userAuth");

const app = express();
//Middlewares
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("<h1>WERA-HIVE api</h1>");
});

app.use("/authentication", authentication);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
