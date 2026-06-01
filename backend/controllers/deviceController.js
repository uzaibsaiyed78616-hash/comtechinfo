import { sessions, initUserSession } from "../server.js";
import User from "../models/User.js";

export const getQRCode = async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await User.findById(userId);
        let session = sessions.get(userId);
        
        if (!session) {
            session = initUserSession(userId);
        }

        const responseData = {
            success: true,
            status: session.ready ? "connected" : (session.qr ? "scanning" : "loading"),
            qr: session.qr || null,
            device: (user.deviceInfo && user.deviceInfo.phoneNumber) ? {
                phoneNumber: user.deviceInfo.phoneNumber,
                ipAddress: user.deviceInfo.ipAddress || "127.0.0.1",
                linkedAt: user.deviceInfo.linkedAt,
                deviceToken: user.deviceInfo.deviceToken
            } : null
        };

        res.json(responseData);
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: "QR Error" });
    }
};

export const getDevices = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        const devices = [];
        if (user.deviceInfo && user.deviceInfo.phoneNumber) {
            devices.push({
                _id: userId,
                phoneNumber: user.deviceInfo.phoneNumber,
                ipAddress: user.deviceInfo.ipAddress || "127.0.0.1",
                linkedAt: user.deviceInfo.linkedAt,
                deviceToken: user.deviceInfo.deviceToken,
                status: "CONNECTED"
            });
        }
        
        res.json({ success: true, devices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};