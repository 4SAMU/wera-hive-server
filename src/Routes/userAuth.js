/** @format */
require("dotenv").config();
const { SECRETWORD } = process.env;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//database models
const User = require("../../Database/Models/UserModel");

router.post("/userRegistration", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: newPassword,
    });
    res.status(200).json({ success: true, status: "ok" });
  } catch (error) {
    res.status(200).json({
      success: false,
      status: "error",
      error: error,
    });
  }
});

router.post("/userLogin", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.json({ success: false, error: "user not found" });
  } else {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        },
        SECRETWORD
      );

      return res.json({ success: true, user: token });
    } else {
      return res.json({ success: false, user: false });
    }
  }
});

router.put("/updateUserDetails", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, status: "error", error: "Token missing" });
  }
  try {
    const decoded = jwt.verify(token, SECRETWORD);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        status: "error",
        error: "user not found",
      });
    } else {
      if (req.body.password) {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        user.password = newPassword;
      }
      user.name = req.body.name;
      user.phoneNumber = req.body.phoneNumber;
      user.email = req.body.email;

      await user.save();
      const newToken = jwt.sign(
        {
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        },
        SECRETWORD
      );
      res.json({ success: true, status: "ok", user: newToken });
    }
  } catch (error) {
    res.json({ success: false, status: "error", error: "invalid token" });
  }
});

module.exports = router;
