import express from "express";
import { webhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/webhook", webhook);

export default router;