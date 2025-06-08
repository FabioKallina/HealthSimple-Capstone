
import express from "express";

import {
    getHabits,
    updateHabit,
    deleteHabit,
    createHabit
} from "../controllers/habitsController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

//GET Habits
router.get("/", getHabits);

//POST Habits
router.post("/", createHabit);

//PUT Habits
router.put("/:habitId/log", updateHabit);

//DELETE Habits
router.delete("/:habitId", deleteHabit);

export default router;