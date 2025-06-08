import Exercise from "../models/exerciseModel.js";

//Get exercise
export const getExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const exercises = await Exercise.find({ userId });

    res.status(200).json({
      status: "success",
      data: exercises,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get exercise",
      error: error.message,
    });
  }
};

//Create exercise
export const createExercise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, category } = req.body;

    const newExercise = await Exercise.create({ name, category, userId });

    res.status(201).json({
      status: "success",
      message: "Exercise created",
      data: newExercise,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create exercise",
      error: error.message,
    });
  }
};
