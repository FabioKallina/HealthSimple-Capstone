
/**
 * CheckIn Routes
 * Handles all checkin-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import express from "express";

import {
    getAllCheckIn,
    createCheckIn,
} from "../controllers/checkinController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET CheckIn
router.get("/", getAllCheckIn);

//POST new CheckIn
router.post("/", createCheckIn);

export default router;