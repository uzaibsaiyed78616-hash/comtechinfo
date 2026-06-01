import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["add", "remove", "credit", "debit"], required: true },
  oldBalance: { type: Number, default: 0 }, // FIXED
  newBalance: { type: Number, default: 0 }, // FIXED
  description: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;