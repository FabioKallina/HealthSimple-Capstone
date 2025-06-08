
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