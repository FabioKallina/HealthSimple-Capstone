
// models/ChallengeProgress.js
import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // format: YYYY-MM-DD
  habitName: { type: String, required: true },
  status: { type: Number, required: true }, // 0 = not done, 1 = partial, 2 = complete
});

const challengeProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  startDate: { type: Date, required: true, default: Date.now },
  habitLogs: [habitLogSchema],
  completed: { type: Boolean, default: false },
  badgeEarned: { type: Boolean, default: false },
});

const ChallengeProgress = mongoose.model("ChallengeProgress", challengeProgressSchema);
export default ChallengeProgress;
