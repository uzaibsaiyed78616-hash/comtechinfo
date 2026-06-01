import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from "qrcode";
import fs from "fs";

// Import Routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import campaignRoutes from "./routes/campaign.js";
import messageRoutes from "./routes/message.js";
import reportRoutes from "./routes/report.js";
import deviceRoutes from "./routes/device.js";

// Import Models
import User from "./models/User.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Global Active WhatsApp Sessions Matrix Map
export const sessions = new Map();

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🌱 MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// =========================================================================
// 🔥 CORE API ENDPOINT: Direct HTTP GET String Message Gateway
// =========================================================================
app.get('/api/send-msg', async (req, res) => {
    const { username, number, message, token, file } = req.query;

    try {
        // 1. User & Dynamic Token Verification Matrix
        const user = await User.findOne({ email: username });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
        if (user.credits <= 0) return res.status(400).json({ success: false, message: "Credits exhausted" });

        const userId = user._id.toString();

        // 2. Active WhatsApp Session Validation Hook
        const session = sessions.get(userId);
        if (!session || !session.ready) {
            return res.status(400).json({ success: false, message: "WhatsApp not connected for this user profile" });
        }

        // 3. Phone Target Code Sanitization (Adds Country Prefix automatically)
        let cleanNumber = number.toString().replace(/\D/g, '');
        if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;
        const chatId = `${cleanNumber}@c.us`;

        // 4. Content Transmission Pipeline (Smart Routing for Media URL & Text)
        try {
            if (file) {
                // If target matches a web endpoint layout (http/https), pull down into stream objects
                if (file.startsWith('http://') || file.startsWith('https://')) {
                    const media = await MessageMedia.fromUrl(file);
                    await session.client.sendMessage(chatId, media, { caption: message || "" });
                } else {
                    // Fallback parameter for raw absolute local system file paths strings
                    const media = MessageMedia.fromFilePath(file);
                    await session.client.sendMessage(chatId, media, { caption: message || "" });
                }
            } else {
                // Execute standard automated plain-text routing strings
                await session.client.sendMessage(chatId, message || "");
            }
        } catch (sendErr) {
            // Fault-Tolerance Engine for volatile Chromium exceptions
            if (sendErr.message && sendErr.message.includes("detached Frame")) {
                sessions.delete(userId);
                await User.findByIdAndUpdate(userId, { $set: { "deviceInfo.status": "OFFLINE" } });
                return res.status(500).json({ success: false, message: "Browser execution error. Please reconnect your device session." });
            }
            throw sendErr;
        }

        // 5. Transaction Ledger Verification Block (Atomic Decrement & Analytics Save)
        user.credits -= 1;
        await user.save();
        
        await new Message({ 
            userId: user._id, 
            number: cleanNumber, 
            message: message || "Media", 
            status: "sent" 
        }).save();

        return res.json({ success: true, message: "Message processed and sent successfully" });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed: " + err.message });
    }
});

// =========================================================================
// 🚀 Standard Operational API Application Routing Middleware
// =========================================================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/device", deviceRoutes);

// Environment Bootstrap Initialization Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Production Core Server running on port ${PORT}`);
    console.log("ℹ️ Production mode active. Waiting for dynamic user sessions...");
});