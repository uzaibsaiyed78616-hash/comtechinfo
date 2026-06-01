import express from "express";
import { getReport, deleteReport } from "../controllers/reportController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET: http://localhost:3000/api/report/all-reports
router.get("/all-reports", auth, getReport);

// DELETE: http://localhost:3000/api/report/delete/:id
//  Yahan "/report/delete" nahi, sirf "/delete/:id" hona chahiye
router.delete("/delete/:id", auth, deleteReport); 

export default router;