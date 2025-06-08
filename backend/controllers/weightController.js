
import Weight from "../models/weightModel.js";

//Get weight data
export const getWeight = async ( req, res ) => {

    try {
        const userId = req.user.id;

        const weight = await Weight.find({ userId });

        res.status(200).json({
            status: "success",
            data: weight,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to get weight data",
            error: error.message,
        })
    }
}

//Create weight data point
export const createWeight = async ( req, res ) => {

    try {
        const userId = req.user.id;
        const { date, weight } = req.body;

        const newWeight = await Weight.create({ date, weight, userId });

        res.status(201).json({
            status: "success",
            message: "Weight created",
            data: newWeight,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to create weight",
            error: error.message,
        });
    }
}