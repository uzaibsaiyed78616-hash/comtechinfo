import express from "express";
import { sendMessage, getDashboardStats } from "../controllers/messageController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", auth, getDashboardStats); // Protected stats with history
router.post("/send-msg", auth, sendMessage);   // Protected sending

export default router;