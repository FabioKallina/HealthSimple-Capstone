
import Water from "../models/waterModel.js";

//Get water data
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

//Create water entry
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