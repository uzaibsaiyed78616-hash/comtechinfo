import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  
  // Naye Fields Real Data Save karne ke liye
  deviceInfo: {
    phoneNumber: { type: String, default: null },
    ipAddress: { type: String, default: null },
    deviceToken: { type: String, default: null },
    linkedAt: { type: Date, default: null }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);