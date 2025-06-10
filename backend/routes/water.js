
/**
 * Water Routes
 * Handles all water-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import express from "express";

import { getWater, createWater } from "../controllers/waterController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET water
router.get("/", getWater);

//POST water
router.post("/", createWater);

export default router;