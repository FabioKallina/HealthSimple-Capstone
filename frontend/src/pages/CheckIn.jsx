import React, { useState, useEffect } from "react";

import "../css/CheckIn.css";
import Mindfulness from "../components/Mindfulness";
import DateNavigator from "../components/DateNavigator";

import API from "../services/checkInAPI";

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "🙂", label: "Content" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "🥰", label: "Lovey" },
  { emoji: "😔", label: "Depressed" },
  { emoji: "🤫", label: "Confident" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "☹️", label: "Lonely" },
  { emoji: "🤕", label: "Hurt" },
  { emoji: "😫", label: "Frustrated" },
  { emoji: "🙁", label: "Disappointed" },
  { emoji: "🥱", label: "Bored" },
  { emoji: "😰", label: "Stressed" },
  { emoji: "😴", label: "Tired" },
];

const getLocalDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset(); // in minutes
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const CheckIn = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [loggedCheckIn, setLoggedCheckIn] = useState({});

  const [selectedDate, setSelectedDate] = useState(getLocalDateString);

  useEffect(() => {
    const fetchCheckIn = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/api/checkin/?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const checkIn = res.data.data;

        if (!checkIn || checkIn.length === 0) {
          console.log("No check-in found for", selectedDate);
          setLoggedCheckIn({});
          setSelectedMood(null);
          setJournal("");
          return;
        }

        const data = checkIn[0];
        setLoggedCheckIn(data);

        //re-populate form field
        const moodOption  = moods.find((m) => m.label === data.mood);
        setSelectedMood(moodOption || null);
        setJournal(data.journal || "");

      } catch (e) {
        console.error("Failed fetching CheckIn data", e);
        setLoggedCheckIn({});
        setSelectedMood(null);
        setJournal("");
      }
    };

    fetchCheckIn();
  }, [selectedDate]);

  const handleSubmit = async () => {
    const checkInData = {
      mood: selectedMood?.label,
      journal,
      date: selectedDate,
    };

    try {
      const token = localStorage.getItem("token");

      await API.post("/api/checkin", checkInData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedMood(null);
      setJournal("");
    } catch (e) {
      console.error("Failed to create submisison", e);
    }
  };

  return (
    <div className="check-in-container">
      <DateNavigator
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <h2 style={{ color: "#0077b6" }}>Daily Mood Check In</h2>

      <div className="mood-container">
        {moods.map((mood) => (
          <div className="mood-btn-display">
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`mood-btn ${selectedMood?.label === mood.label ? "selected" : ""}`}
            >
              {mood.emoji}
            </button>
            <p className="label-text">{mood.label}</p>
          </div>
        ))}
      </div>

      <div className="journal-container">
        <h2 style={{ color: "#0077b6" }}>Journal</h2>

        <textarea
          placeholder="Your thoughts today..."
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          rows={4}
          className="journal-display"
        />

        <button className="check-in-btn" onClick={handleSubmit}>
          Submit Check-In
        </button>
      </div>

      <Mindfulness />
    </div>
  );
};

export default CheckIn;
