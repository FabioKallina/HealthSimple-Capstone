
/**
 * Description: This file handles steps controllers
 * Author: Fabio Kallina de Paula
 * Created: June 6, 2025
 */

import Steps from "../models/stepsModel.js";

/**
 * Get all steps data for the logged-in user
 * @route GET /api/steps
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSteps = async ( req, res ) => {

    try {
        const userId = req.user.id;
        
        const steps = await Steps.find({ userId });

        res.status(200).json({
            status: "success",
            data: steps,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get steps data",
            error: error.message,
        });
    }
}

/**
 * Creates steps data for the logged-in user
 * @route POST /api/steps
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createSteps = async ( req, res ) => {

    try {
        const userId = req.user.id;
        const { date, steps } = req.body;

        const newSteps = await Steps.create({ userId, steps, date });

        res.status(201).json({
            status: "success",
            message: "Steps created",
            data: newSteps,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create steps data",
            error: error.message,
        });
    }
}