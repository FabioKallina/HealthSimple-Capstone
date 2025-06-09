import React, { useEffect, useState } from "react";
import "../../css/WaterTracker.css";

import API from "../../services/waterAPI";

//Helper to get today's date in local time
const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const WaterTracker = () => {
  const goal = 3000; // ml
  const today = getToday();

  const [intake, setIntake] = useState(0);
  const [customAmount, setCustomAmount] = useState("");

  //Load from localStorage on first load
  useEffect(() => {
    const fetchWater = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await API.get("/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const todayEntries = res.data.data.filter(
          (entry) => entry.date === today
        );
        const totalIntake = todayEntries.reduce(
          (sum, entry) => sum + entry.water,
          0
        );
        setIntake(totalIntake);
      } catch (e) {
        console.error("Failed fetching water data", e);
      }
    };
    fetchWater();
  }, [today]);

  const addWater = async (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) return;

    const newTotal = Math.min(intake + amount, goal);
    setIntake(newTotal);
    setCustomAmount(""); // clear input after adding

    const token = localStorage.getItem("token");

    try {
      await API.post(
        "/",
        { date: today, water: amount },
        { headers: { Authorization: `Bearer ${token} ` } }
      );
    } catch (e) {
      console.error("Failed adding water", e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addWater(parseInt(customAmount));
  };

  const fillHeight = `${(intake / goal) * 100}%`;

  return (
    <div className="water-tracker-card">
      <h3 style={{ color: "#000" }}>💧 Water Intake</h3>
      <div className="bottle-container">
        <div className="bottle">
          <div className="fill" style={{ height: fillHeight }}></div>
          <div className="bottle-label">
            {intake}ml / {goal}ml
          </div>
        </div>
      </div>
      <button onClick={() => addWater(250)} className="add-water-btn">
        +250ml
      </button>
      <form onSubmit={handleSubmit} className="water-form">
        <input
          type="number"
          placeholder="Custom Amount..."
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
        <button type="submit" className="add-water-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default WaterTracker;
