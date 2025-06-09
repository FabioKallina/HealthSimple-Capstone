import React, { useState, useEffect } from "react";

import "../css/Habits.css";

import DateNavigator from "../components/DateNavigator";

import API from "../services/habitsAPI.js";
import axios from "axios";

const initialHabits = [
  { id: 1, name: "Wake up 8:00AM", status: 0 },
  { id: 2, name: "Workout", status: 0 },
  { id: 3, name: "Sleep 8 Hours", status: 0 },
  { id: 4, name: "Cardio", status: 0 },
  { id: 5, name: "Stretch", status: 0 },
  { id: 6, name: "Drink 4L of water", status: 0 },
  { id: 7, name: "No Alcohol", status: 0 },
  { id: 8, name: "10,000 steps", status: 0 },
  { id: 9, name: "Diet", status: 0 },
  { id: 10, name: "Sleep by 10:30", status: 0 },
  { id: 11, name: "No Sugar", status: 0 },
  { id: 12, name: "Read 30 Pages", status: 0 },
];

const statusClasses = {
  unspecified: "unspecified",
  "not completed": "not-completed",
  "partially completed": "partial",
  completed: "completed",
};

const getLocalDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset(); // in minutes
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [edit, setEdit] = useState(false);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3000/api/habits?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const habitsWithLogs = res.data.data.map((habit) => ({
        _id: habit._id,
        name: habit.name,
        logs: habit.logs, // keep all logs
      }));

      setHabits(habitsWithLogs);
    } catch (e) {
      console.error("Failed fetching habits", e);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const toggleStatus = async (id) => {
    const habit = habits.find((h) => h._id === id);
    const log = habit.logs.find((log) => log.date === selectedDate);
    const currentStatus = log?.status || "unspecified";

    const statusOptions = [
      "unspecified",
      "not completed",
      "partially completed",
      "completed",
    ];
    const nextIndex = (statusOptions.indexOf(currentStatus) + 1) % 4;
    const newStatus = statusOptions[nextIndex];

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/habits/${id}/log`,
        { date: selectedDate, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      const updatedHabits = habits.map((h) => {
        if (h._id !== id) return h;

        const updatedLogs = [...h.logs];
        const existingLogIndex = updatedLogs.findIndex(
          (log) => log.date === selectedDate
        );

        if (existingLogIndex >= 0) {
          updatedLogs[existingLogIndex] = {
            ...updatedLogs[existingLogIndex],
            status: newStatus,
          };
        } else {
          updatedLogs.push({ date: selectedDate, status: newStatus });
        }

        return { ...h, logs: updatedLogs };
      });

      setHabits(updatedHabits);
    } catch (e) {
      console.error("Failed to update habit status", e);
    }
  };

  const addNewHabit = async () => {
    if (newHabit.trim() === "") return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3000/api/habits",
        { name: newHabit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabits((prev) => [
        ...prev,
        { ...res.data.data, status: "unspecified" },
      ]);
      setNewHabit("");
    } catch (e) {
      console.error("Failed adding new habit", e);
    }
  };

  const deleteHabit = async (idToDelete) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:3000/api/habits/${idToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHabits((prev) => prev.filter((habit) => habit._id !== idToDelete));
    } catch (e) {
      console.error("Failed to delete habit", e);
    }
  };

  return (
    <div className="habits-container">
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <h2 style={{ color: "#0077b6", marginBottom: 10 }}>Habit Tracker</h2>
      <div className="legend-display">
        <p>🟦 Unspecified</p>
        <p>🟥 Not Completed</p>
        <p>🟨 Partially Completed</p>
        <p>🟩 Completed</p>
      </div>
      <div className="habits-grid">
        {habits.map((habit) => {
          const log = habit.logs.find((log) => log.date === selectedDate);
          const status = log?.status || "unspecified";

          return (
            <div key={habit._id} className="habit-wrapper">
              <button
                className={`habit-btn ${statusClasses[status]}`}
                onClick={() => toggleStatus(habit._id)}
              >
                {habit.name}
              </button>
              {edit && (
                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(habit._id)}
                >
                  X
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="add-habit-form">
        <input
          type="text"
          placeholder="Add new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button className="add-habit-btn" onClick={addNewHabit}>
          Add
        </button>

        <button className="edit-habits-btn" onClick={() => setEdit(!edit)}>
          Edit Habits
        </button>
      </div>
    </div>
  );
};

export default Habits;
