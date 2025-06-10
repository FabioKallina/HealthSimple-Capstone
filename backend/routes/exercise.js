
/**
 * Exercise Routes
 * Handles all exercise-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 6, 2025
 */

import express from "express";
import { createExercise, deleteExercise, getExercises } from "../controllers/exerciseController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET exercises
router.get("/", getExercises);

//POST exercise
router.post("/", createExercise);

//DELETE exercise
router.delete("/:exerciseId", deleteExercise);

export default router;