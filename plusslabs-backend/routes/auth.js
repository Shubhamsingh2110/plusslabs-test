import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    const userId = new mongoose.Types.ObjectId(); // Generate a unique userId
    user = new User({ _id: userId, name, email, password });

    // Save the new user
    await user.save();

    // Generate JWT Token
    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token, userId: user._id }); // Send userId in response
    });

  } catch (err) {
    console.error("❌ Signup Error:", err.message);
    res.status(500).send("Server error");
  }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = { user: { id: user._id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) throw err;
            res.json({ token, userId: user._id });
        });

    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).send("Server error");
    }
});

export default router;
