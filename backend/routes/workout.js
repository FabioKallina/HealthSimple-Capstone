
import express from "express";

import {
    getAllWorkouts,
    deleteWorkout,
    createWorkout,
    updateWorkout,
} from "../controllers/workoutController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

//GET all workouts
router.get("/", authenticateToken, getAllWorkouts);

//CREATE a workout
router.post("/", authenticateToken, createWorkout);

//UPDATE a workout
router.put("/:id", authenticateToken, updateWorkout);

//DELETE workout
router.delete("/:id", authenticateToken, deleteWorkout);

export default router;