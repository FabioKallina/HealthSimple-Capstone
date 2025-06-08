import Habit from "../models/habitsModel.js";

//Get all habits for a user
export const getHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ userId });

    res.status(200).json({
      status: "success",
      data: habits,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get all habits",
      error: error.message,
    });
  }
};

//Create a new habit
export const createHabit = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    const newHabit = await Habit.create({ userId, name });
    res.status(201).json({
      status: "success",
      message: "Habit created!",
      data: newHabit,
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    res.status(500).json({
      status: "error",
      message: "Failed creating habit",
      error: error.message,
    });
  }
};

//Delete a habit
export const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    await Habit.findByIdAndDelete(habitId);

    res.status(200).json({
      status: "success",
      message: "habit deleted!",
    });
  } catch (error) {
    res.status(500).json({
      status: "success",
      message: "Failed to delete habit",
      error: error.message,
    });
  }
};

//Update habit for today's log
export const updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { status } = req.body;
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const habit = await Habit.findById(habitId);
    const existingLog = habit.logs.find((log) => log.date === today);

    if (existingLog) {
      existingLog.status = status;
    } else {
      habit.logs.push({ date: today, status });
    }

    await habit.save();
    res.status(200).json({
      status: "success",
      message: "Habit updated!",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update habit",
      error: error.message,
    });
  }
};
