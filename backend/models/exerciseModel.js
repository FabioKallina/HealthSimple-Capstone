
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;