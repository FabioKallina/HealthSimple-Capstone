
/**
 * Challenge Routes
 * Handles all challenge-related endpoints
 * All routes are protected and require JWT authentication
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import express from "express";
import { joinChallenge, getChallenges, completeChallenge } from "../../controllers/communityControllers/challengesController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);

//GET challenges
router.get("/", getChallenges)

//POST /api/challenges/join
router.post("/join", joinChallenge);

//COMPLETE challenge
router.patch("/:id/done", completeChallenge)

export default router;