
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