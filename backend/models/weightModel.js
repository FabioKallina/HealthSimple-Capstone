
import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date : { type: String, required: true },
    weight: { type: Number, required: true },
});

const Weight = mongoose.model("Weight", weightSchema);
export default Weight;