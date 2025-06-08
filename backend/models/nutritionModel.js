
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, default: Date.now },
    meal: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Water"], required: true },
    foodId: { type: String }, // API-specific ID (e.g., for Edamam or similar)
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
});

const Food = mongoose.model("Food", foodSchema);

export default Food;