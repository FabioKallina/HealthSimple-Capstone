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

/**
 * Delete exercise for the logged-in user
 * @route DELETE /api/exercises/:exerciseId
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    console.log("Attempting to delete exercise:", exerciseId);

    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);

    if (!deletedExercise) {
      console.log("No matching exercise found with ID:", exerciseId);
      return res.status(404).json({
        status: "fail",
        message: "Exercise not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Exercise deleted",
    });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete exercise",
      error: error.message,
    });
  }
};

