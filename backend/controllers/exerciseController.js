
/**
 * Description: This file handles exercise controllers
 * Author: Fabio Kallina de Paula
 * Created: June 5, 2025
 */

import Exercise from "../models/exerciseModel.js";

/**
 * Get all exercise for the logged-in user
 * @route GET /api/exercises
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

/**
 * Create exercise for the logged-in user
 * @route POST /api/exercises
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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
