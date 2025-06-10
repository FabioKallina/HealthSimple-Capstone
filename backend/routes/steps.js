
/**
 * Steps Routes
 * Handles all setp-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 6, 2025
 */

import express from "express";

import { getSteps, createSteps } from "../controllers/stepsController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET steps
router.get("/", getSteps);

//POST steps
router.post("/", createSteps);

export default router;