import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  // If user does not exist → SIGN UP
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashed });
  } else {
    // If exists → LOGIN
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

export default router;
