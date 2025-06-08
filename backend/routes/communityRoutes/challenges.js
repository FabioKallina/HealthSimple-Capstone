
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