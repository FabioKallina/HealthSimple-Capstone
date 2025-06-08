
import mongoose from "mongoose";

const waterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    water: { type: Number, required: true },
});

const Water = mongoose.model("Water", waterSchema);
export default Water;