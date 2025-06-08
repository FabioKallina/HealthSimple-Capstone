// models/Challenge.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: { type: Number, required: true }, // e.g., 7 days, 30 days
  requiredHabits: [
    {
      name: String,
      count: Number,
    },
  ],
  badgeName: String,
});

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;

