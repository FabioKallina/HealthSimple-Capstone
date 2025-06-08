import Challenge from "../../models/communityModels/challengesModel.js"; // static templates
import ChallengeProgress from "../../models/communityModels/challengeProgressModel.js"; // user tracking

import mongoose from "mongoose";

const challengeTemplates = [
  {
    id: 1,
    name: "🏋️‍♀️ Complete 5 workouts this week",
    requiredHabits: [{ name: "Workout", count: 5 }],
    duration: 7,
    badge: "Workout Warrior",
  },
  {
    id: 2,
    name: "🥗 Stick to your diet for 30 days",
    requiredHabits: [{ name: "Diet", count: 30 }],
    duration: 30,
    badge: "Nutrition Ninja",
  },
  {
    id: 3,
    name: "🧘‍♂️ Meditate daily for a week",
    requiredHabits: [{ name: "Meditate", count: 7 }],
    duration: 7,
    badge: "Mindful Master",
  },
];

//Get challenges
export const getChallenges = async (req, res) => {
  try {
    const userId = req.user.id;

    const templates = await Challenge.find();
    const allProgress = await ChallengeProgress.find();
    const userProgress = await ChallengeProgress.find({ userId });

    const enriched = templates.map((template) => {
      const userEntry = userProgress.find(
        (c) => c.challengeId.toString() === template._id.toString()
      );

      const totalUsers = allProgress.filter(
        (c) => c.challengeId.toString() === template._id.toString()
      ).length;

      const usersCompleted = allProgress.filter(
        (c) =>
          c.challengeId.toString() === template._id.toString() && c.completed
      ).length;

      return {
        ...template.toObject(),
        joined: !!userEntry,
        completed: userEntry?.completed || false,
        usersCompleted,
        totalUsers,
      };
    });

    res.status(200).json({ status: "success", data: enriched });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "failed to retrieve challenges",
      error: error.message,
    });
  }
};

//Join challenge
export const joinChallenge = async (req, res) => {
  const { challengeId } = req.body;
  const userId = req.user.id;

  if (!userId || !challengeId) {
    return res.status(400).json({
      message: `Missing field(s): ${!userId ? 'userId ' : ''}${!challengeId ? 'challengeId' : ''}`,
    });
  }

  try {
    const existing = await ChallengeProgress.findOne({ userId, challengeId });
    if (existing) {
      return res.status(400).json({ message: "Already joined this challenge" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const newProgress = new ChallengeProgress({
      userId,
      challengeId,
      startDate: new Date(),
      habitLogs: [],
      completed: false,
      badgeEarned: false,
    });

    await newProgress.save();
    res.status(201).json({ status: "success", data: newProgress });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to join challenge",
      error: error.message,
    });
  }
};

//Complete challenge
export const completeChallenge = async (req, res) => {
  try {
    const { id } = req.params; // this is the challengeId
    const userId = req.user.id;

    const progress = await ChallengeProgress.findOne({
      challengeId: id,
      userId,
    });

    if (!progress) {
      return res
        .status(404)
        .json({ status: "error", message: "Challenge not found" });
    }

    progress.completed = true;
    progress.badgeEarned = true;
    await progress.save();

    res.status(200).json({
      status: "success",
      message: "Challenge completed",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error completing challenge",
      error: error.message,
    });
  }
};
