import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import workoutRoutes from "./routes/workout.js";
import nutritionRoutes from "./routes/nutrition.js";
import checkInRoutes from "./routes/checkin.js";
import habitRoutes from "./routes/habits.js";
import friendsRoutes from "./routes/communityRoutes/friends.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import challengeRoutes from "./routes/communityRoutes/challenges.js";
import stepsRoutes from "./routes/steps.js";
import weightRoutes from "./routes/weight.js";
import waterRoutes from "./routes/water.js";
import exerciseRoutes from "./routes/exercise.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
connectDB();

// Routes
app.use("/api/workout", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/steps", stepsRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/exercises", exerciseRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
