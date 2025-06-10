
/**
 * Weight Routes
 * Handles all weight-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import express from "express";

import { getWeight, createWeight } from "../controllers/weightController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET weight
router.get("/", getWeight);

//POST weight
router.post("/", createWeight);

export default router;