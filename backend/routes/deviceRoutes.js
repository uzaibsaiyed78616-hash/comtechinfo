import express from "express";
import { getDevices, getQRCode } from "../controllers/deviceController.js";
import { auth } from "../middleware/auth.js";
import { sessions } from "../server.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/list", auth, getDevices);
router.get("/get-qr", auth, getQRCode);

// Action: Logout & Delete
router.post("/logout", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const session = sessions.get(userId);
        
        if (session) {
            if (session.client) {
                await session.client.logout().catch(() => {});
                await session.client.destroy().catch(() => {});
            }
            sessions.delete(userId);
        }

        // Database se device info clear karo taaki naya linking clean ho
        await User.findByIdAndUpdate(userId, { $set: { deviceInfo: null } });
        res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ success: false, message: "Server logout error" });
    }
});

// Action: Online / Offline / Refresh status update
router.post("/update-status", auth, async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user.id;

        // DB mein status update (ONLINE/OFFLINE)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { "deviceInfo.status": status.toUpperCase() } },
            { new: true }
        );

        if (!updatedUser || !updatedUser.deviceInfo) {
            return res.status(400).json({ success: false, message: "device is not linked!" });
        }

        res.json({ success: true, message: `Device marked as ${status}` });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ success: false, message: "Status update failed" });
    }
});

export default router;