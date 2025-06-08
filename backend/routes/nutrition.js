
import express from "express";

import {
    getAllFoods,
    createFood,
    deleteFood
} from "../controllers/nutritionController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

//Protect all routes with token auth
router.use(authenticateToken);

//GET all foods
router.get("/", getAllFoods);

//CREATE food
router.post("/", createFood);

//DELETE food
router.delete("/:id", deleteFood);

export default router;