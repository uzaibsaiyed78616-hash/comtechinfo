import express from "express";
const router = express.Router();
import User from "../models/User.js";
import Transaction from "../models/Transaction.js"; 
import { auth, isAdmin } from "../middleware/auth.js";
import bcrypt from "bcryptjs";

// 1. Get All Users
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 2. Add New User
router.post("/add-user", auth, isAdmin, async (req, res) => {
  const { email, password, role, credits } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role: role || "user", 
      credits: Number(credits) || 0 
    });
    
    await newUser.save();
    res.json({ success: true, message: "User Created Successfully!" });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 3. Update Credits (FIXED BALANCES)
router.post("/update-credits", auth, isAdmin, async (req, res) => {
  const { userId, amount, type, remark } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    const oldBalance = Number(user.credits) || 0;
    const updateAmount = Number(amount) || 0;

    const change = type === 'add' ? updateAmount : -updateAmount;
    user.credits = oldBalance + change;
    const newBalance = user.credits;

    await user.save();

    const newTransaction = new Transaction({
      userId: user._id,
      amount: updateAmount,
      type: type,
      oldBalance: oldBalance,
      newBalance: newBalance,
      description: remark || `Admin manual update`
    });
    
    await newTransaction.save();
    res.json({ success: true, newBalance: user.credits });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 4. Delete User
router.delete("/delete-user/:id", auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Update User
router.put("/update-user/:id", auth, isAdmin, async (req, res) => {
  try {
    const { role, credits } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role, credits: Number(credits) },
      { new: true }
    );
    res.json({ success: true, message: "User Updated!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Get All Transactions
router.get("/transactions", auth, isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

export default router;