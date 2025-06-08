
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