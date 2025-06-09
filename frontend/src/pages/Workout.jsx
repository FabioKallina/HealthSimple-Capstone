import React, { useEffect, useState } from "react";
import "../css/Workout.css";

import ExerciseCard from "../components/ExerciseCard";
import WorkoutPopup from "../components/WorkoutPopup";

import { exercises as exerciseData } from "../constants/exercises";

import API from "../services/api";

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("chest");
  const [popup, setPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [userWorkouts, setUserWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/api/workout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserWorkouts(res.data.data || []);
    } catch (e) {
      console.error("Failed fetching workouts:", e);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const defaultCategories = [
    "chest",
    "back",
    "legs",
    "biceps",
    "triceps",
    "shoulders",
    "abs",
  ];

  useEffect(() => {
    const filteredExercises = exerciseData.filter(
      (exercise) => exercise.category.toLowerCase() === selectedCategory
    );
    setExercises(filteredExercises);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleStartWorkout = () => {
    setPopup(!popup);
  };

  const handleCancelWorkout = () => {
    setPopup(!popup);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = exerciseData.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="workout-container">
      <div className="start-btn-container">
        <button className="start-btn" onClick={handleStartWorkout}>
          Start Your Workout
        </button>
      </div>

      {popup && (
        <WorkoutPopup
          searchQuery={searchQuery}
          searchResults={searchResults}
          handleSearch={handleSearch}
          onCancel={handleCancelWorkout}
          onWorkoutFinish={fetchWorkouts}
        />
      )}

      <div className="category-list">
        {defaultCategories.map((category, index) => (
          <button
            className="category-btn"
            onClick={() => handleCategoryClick(category)}
            key={index}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="exercise-grid">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        ) : (
          <p>No Exercises found for this category</p>
        )}
      </div>

      <div className="workouts-history">
        <h2
          style={{
            color: "#0077b6",
            marginTop: 30,
            marginBottom: 30,
            alignSelf: "center",
            fontSize: "2.3rem",
          }}
        >
          Workout History
        </h2>
        <div className="history-display">
          {[...userWorkouts]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((workout) => (
              <div key={workout._id} className="saved-workout">
                <div className="saved-info">
                  <p>Date: {formatDate(workout.date)}</p>
                  <p>Time: {formatTime(workout.timeElapsed)} min</p>
                </div>
                <div className="saved-card">
                  {Array.isArray(workout.exercises) &&
                  workout.exercises.length > 0 ? (
                    workout.exercises.map((exercise, index) => (
                      <div key={index} className="saved-exercise">
                        <h2 style={{ color: "#0077b6" }}>{exercise.name}</h2>
                        <ul>
                          {exercise.sets.map((set, i) => (
                            <li key={i}>
                              Set {i + 1}: {set.weight} lbs × {set.reps} reps
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No exercises found.</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Workout;
