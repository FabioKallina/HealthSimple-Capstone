
import mongoose from "mongoose";

const stepsSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    steps: { type: Number, required: true, default: 0 },
});

const Steps = mongoose.model("Steps", stepsSchema);
export default Steps;