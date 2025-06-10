
/**
 * Description: This file handles water controllers
 * Author: Fabio Kallina de Paula
 * Created: June 6, 2025
 */

import Water from "../models/waterModel.js";

/**
 * Get all water data for the logged-in user
 * @route GET /api/water
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getWater = async ( req, res ) => {

    try {
        const userId = req.user.id;

        const water = await Water.find({ userId });

        res.status(200).json({
            status: "success",
            data: water,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed getting water data",
            error: error.message,
        });
    }
}

/**
 * Create water data point for the logged-in user
 * @route POST /api/water
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createWater = async ( req, res ) => {

    try {
        const userId = req.user.id;
        const { date, water } = req.body;

        const updatedWater = await Water.findOneAndUpdate(
            { userId, date },
            { $inc: { water } },
            { new: true, upsert: true }
          );

        res.status(201).json({
            status: "success",
            message: "Created water entry",
            data: updatedWater,
        });
    } catch (error) {
        res.staus(500).json({
            status: "error",
            message: "Failed creating water entry",
            error: error.message,
        });
    }
}