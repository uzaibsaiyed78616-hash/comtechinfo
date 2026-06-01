import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Login Failed: Email not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Login Failed: Incorrect password." });
    }

    // Token mein role 
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      "SECRET_KEY_123", 
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        email: user.email,
        role: user.role || "user", 
        credits: user.credits 
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      credits: 100, 
      role: "user" 
    });

    res.json({ message: "Registration successful. You can now log in." });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
};