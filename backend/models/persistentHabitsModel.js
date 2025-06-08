
import mongoose from "mongoose";

const persistentHabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habits: [
    {
      name: String,
      id: String, // UUID or similar for frontend
    },
  ],
});

const PersistentHabits = mongoose.model("PersistentHabits", persistentHabitSchema)
export default PersistentHabits;
