
// scripts/seedChallenges.js or a POST route for admin seeding

import mongoose from "mongoose";
import Challenge from "../models/communityModels/challengesModel.js"; // the static one

const challengeTemplates = [
  {
    title: "🏋️‍♀️ Complete 5 workouts this week",
    requiredHabits: [{ name: "Workout", count: 5 }],
    duration: 7,
    badgeName: "Workout Warrior",
  },
  {
    title: "🥗 Stick to your diet for 30 days",
    requiredHabits: [{ name: "Diet", count: 30 }],
    duration: 30,
    badgeName: "Nutrition Ninja",
  },
  {
    title: "🧘‍♂️ Meditate daily for a week",
    requiredHabits: [{ name: "Meditate", count: 7 }],
    duration: 7,
    badgeName: "Mindful Master",
  },
];

const seedChallenges = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Challenge.deleteMany();
  await Challenge.insertMany(challengeTemplates);
  console.log("Seeded challenges!");
  process.exit();
};

seedChallenges();
