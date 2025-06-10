
/**
 * Description: This file handles workout controllers
 * Author: Fabio Kallina de Paula
 * Created: May 26, 2025
 */

import Workout from "../models/workoutModel.js";
import mongoose from "mongoose";

/**
 * Get all workouts for the logged-in user
 * @route GET /api/workout
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ status: "error", message: "User not authenticated" });
    }

    const workouts = await Workout.find({ userId });
    res.status(200).json({ status: "success", data: workouts });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch workouts",
      error: error.message,
    });
  }
};

/**
 * Create a workout for the logged-in user
 * @route POST /api/workout
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Received workout data:", req.body);
    const { exercises, date, timeElapsed } = req.body;

    //Validate
    if (!exercises || !Array.isArray(exercises)) {
      return res.status(400).json({
        status: "error",
        message: "Workouts exercises are required.",
      });
    }

    const newWorkout = new Workout({
      exercises,
      timeElapsed,
      date: date ? new Date(date) : Date.now(),
      userId,
    });

    const savedWorkout = await newWorkout.save();

    res.status(201).json({ status: "success", data: savedWorkout });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Update a workout for the logged-in user
 * @route PUT /api/workout/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { sets } = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { sets },
      { new: true } //return the updated workout
    );

    if (!updatedWorkout) {
      res.status(404).json({
        status: "error",
        message:
          "Could not find workout or you do not have permission to edit it.",
      });
    }

    res.status(200).json({ status: "success", data: updatedWorkout });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating workout",
      error: error.message,
    });
  }
};

/**
 * Delete workouts for the logged-in user
 * @route DELETE /api/workout/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await Workout.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({
        status: "error",
        message:
          "Could not find workout or you do not have permission to delete it",
      });
    }

    res.status(200).json({ status: "success", message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete workout",
      error: error.message,
    });
  }
};
