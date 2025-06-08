
import Habit from "../models/habitsModel.js";
import defaultHabits from "../utils/defaultHabits.js";

export const initializeHabitsForUser = async (userId) => {
    try {
        const habitsWithUser = defaultHabits.map(habit => ({
            ...habit,
            userId
        }));
        await Habit.insertMany(habitsWithUser);
    } catch (error) {
        console.error("Failed to initialize default habits for user", error);
        throw error;
    }
}