import React, { useEffect, useRef, useState } from "react";

import SearchBar from "./SearchBar";

import "../css/WorkoutPopup.css";
import SetCard from "./SetCard";

import { exercises as exerciseData, exercises } from "../constants/exercises";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import axios from "axios";

const WorkoutPopup = ({ onCancel, onWorkoutFinish }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [addedExercises, setAddedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(null);

  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] = useState("chest");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userExercises, setUserExercises] = useState([]);

  const timeRef = useRef(null);

  useEffect(() => {
    timeRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeRef.current);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const allExercises = [...exerciseData, ...userExercises];
    const results = allExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const handleAddExercise = (exercise) => {
    if (!addedExercises.some((ex) => ex.name === exercise.name)) {
      const newExercise = {
        ...exercise,
        id: crypto.randomUUID(),
      };
      setAddedExercises((prev) => [...prev, newExercise]);
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRemoveExercise = (id) => {
    setAddedExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id)
    );
  };

  const handleFinishWorkout = async () => {
    clearInterval(timeRef.current);
    setWorkoutFinished(true);

    const now = new Date();
    setWorkoutDate(now);

    const summary = addedExercises.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets || [],
    }));

    setWorkoutSummary(summary);

    const workoutData = {
      date: now.toISOString(),
      timeElapsed,
      exercises: summary,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/api/workout`, workoutData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (onWorkoutFinish) onWorkoutFinish();
    } catch (e) {
      console.error("Error Saving Workout:", e);
      alert("Failed to save workout. Try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const handleCreateExercise = async () => {
    if (!newExerciseName.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/exercises`,
        { name: newExerciseName, category: newExerciseCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(newExerciseCategory, newExerciseCategory);
      console.log(res.data.data);

      const alreadyExists = [...exerciseData, ...userExercises].some(
        (ex) => ex.name.toLowerCase() === newExerciseName.toLowerCase()
      );
      if (alreadyExists) {
        alert("Exercise already exists.");
        return;
      }

      const created = res.data.data;

      // Update user exercises
      setUserExercises((prev) => [...prev, created]);

      // Reset form
      setNewExerciseName("");
      setNewExerciseCategory("chest");
      setShowCreateForm(false);

      // Automatically add the new exercise to search results and workout
      handleAddExercise({ ...created, id: crypto.randomUUID() });
    } catch (e) {
      console.error("Failed to create exercise", e);
    }
  };

  const handleDeleteUserExercise = async (exerciseId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/api/exercises/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //Remove it from UI
      setUserExercises((prev) =>
        prev.filter((exercise) => exercise._id !== exerciseId)
      );

      //Clear from search results
      setSearchResults((prev) =>
        prev.filter((exercise) => exercise._id !== exerciseId)
      );
    } catch (e) {
      console.error("Failed to delete exercise", e);
    }
  };

  useEffect(() => {
    const fetchUserExercises = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${BASE_URL}/api/exercises`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserExercises(res.data.data || []);
      } catch (e) {
        console.error("Failed to load user exercises", e);
      }
    };

    fetchUserExercises();
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Workout Started!</h2>
        <button className="timer-btn">{formatTime(timeElapsed)}</button>
        <button className="finish-btn" onClick={handleFinishWorkout}>
          Finish
        </button>
        <p>Select your exercises and begin!</p>

        <div className="exercise-list">
          {addedExercises.map((exercise) => (
            <SetCard
              key={exercise.id}
              exercise={exercise}
              onRemove={() => handleRemoveExercise(exercise.id)}
              onUpdateSets={(sets) => {
                setAddedExercises((prev) =>
                  prev.map((ex) => (ex.id ? { ...ex, sets } : ex))
                );
              }}
            />
          ))}
        </div>

        {showSearch && (
          <div className="search-display">
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
            {searchResults.map((exercise, idx) => (
              <div key={idx} className="search-result-item">
                {exercise.image ? (
                  <img className="list-img" src={exercise.image} />
                ) : (
                  <button
                    className="delete-ex-btn"
                    onClick={() => handleDeleteUserExercise(exercise._id)}
                  >
                    ❌ Delete
                  </button>
                )}
                <div className="list-items">
                  <span>{exercise.name}</span>
                  <button
                    className="add-btn"
                    onClick={() => handleAddExercise(exercise)}
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))}

            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="create-ex-btn"
              >
                + Create New Exercise
              </button>
            ) : (
              <div className="create-form">
                <input
                  type="text"
                  placeholder="Exercise Name"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                />
                <select
                  value={newExerciseCategory}
                  onChange={(e) => setNewExerciseCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="chest">Chest</option>
                  <option value="back">Back</option>
                  <option value="legs">Legs</option>
                  <option value="biceps">Biceps</option>
                  <option value="triceps">Triceps</option>
                  <option value="shoulders">Shoulders</option>
                  <option value="abs">Abs</option>
                </select>
                <button onClick={handleCreateExercise} className="save-ex-btn">
                  Save Exercise
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="cancel-ex-btn"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="add-exercise-btn"
          onClick={() => setShowSearch(!showSearch)}
        >
          Add Exercises
        </button>

        <button className="close-btn" onClick={onCancel}>
          Close
        </button>
      </div>

      {workoutFinished && (
        <div className="summary-overlay">
          <div className="summary-card">
            <h2>Workout Summary</h2>
            <p className="summary-time">
              {formatDate(workoutDate)} | Duration: {formatTime(timeElapsed)}{" "}
              min
            </p>

            <div className="summary-exercises">
              {workoutSummary.map((exercise, index) => (
                <div key={index} className="summary-exercise">
                  <h4>{exercise.name}</h4>
                  {exercise.sets.map((set, i) => (
                    <p key={i}>
                      Set {i + 1}: {set.weight}lbs x {set.reps} reps
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <button className="summary-close" onClick={onCancel}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPopup;
