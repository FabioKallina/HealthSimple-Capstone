
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    colorState: { type: String, enum: ["unspecified", "not completed", "partially completed", "completed"], default: "unspecified"},
    logs: [
        {
        date: { type: String, required: true }, //Store as "YYYY-MM-DD"
        status: { type: String, enum: ["unspecified", "not completed", "partially completed", "completed"], default: "unspecified" },
    },
],
});

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;