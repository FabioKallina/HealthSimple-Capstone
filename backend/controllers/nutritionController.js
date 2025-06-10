
/**
 * Description: This file handles nutrition controllers
 * Author: Fabio Kallina de Paula
 * Created: June 4, 2025
 */

import Food from "../models/nutritionModel.js";
import mongoose from "mongoose";


/**
 * Get all nutrition data for the logged-in user
 * @route GET /api/nutrition
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllFoods = async (req, res) => {
  try {

    const { date } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ status: "error", message: "User not authenticated" });
    }

    const filter = {
        userId
      };

      console.log("Filter used for DB query:", filter);

    if ( date ) {
        filter.date = date; // Expecting format "YYYY-MM-DD"
    }

    const foods = await Food.find(filter);
    res.status(200).json({ status: "success", data: foods });
    
  } catch (err) {
    console.error("Error fetching foods:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch foods",
      error: err.message,
    });
  }
};

/**
 * Create nutrition data for the logged-in user
 * @route POST /api/nutrition
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createFood = async (req, res) => {
  try {

    const {
      name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      date,
      meal,
      foodId,
    } = req.body;

    //Basic validation
    const requiredFields = [
      name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      meal,
    ];
    const hasUndefined = requiredFields.some((field) => field === undefined);

    if (hasUndefined) {
      return res.status(400).json({
        status: "error",
        message: "All fields required",
      });
    }

    const newFood = new Food({
      name,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      meal,
      userId: req.user.id,
      foodId,
      date,
    });

    const savedFood = await newFood.save();

    res.status(201).json({ status: "success", data: savedFood });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to create food item",
      error: err.message,
    });
  }
};

/**
 * Delete nutrition data for the logged-in user
 * @route DELET /api/nutrition/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const foodItem = await Food.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!foodItem) {
      return res.status(404).json({
        status: "error",
        message: "Could not find item to delete",
      });
    }

    res.status(200).json({ status: "success", message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete food item",
      error: err.message,
    });
  }
};
