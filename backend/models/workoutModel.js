
import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    reps: { type: Number, required: true},
});

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: [setSchema],
});

const workoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    timeElapsed: { type: Number },
    exercises: [exerciseSchema],
});

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;