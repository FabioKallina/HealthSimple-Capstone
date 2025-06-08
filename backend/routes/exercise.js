
import express from "express";
import { createExercise, getExercises } from "../controllers/exerciseController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET exercises
router.get("/", getExercises);

//POST exercise
router.post("/", createExercise);

export default router;