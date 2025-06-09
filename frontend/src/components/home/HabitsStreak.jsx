import React, { useState, useEffect } from "react";
import { parse, format, addDays } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import API from "../../services/habitsAPI.js";

import "../../css/HeatmapCustom.css";

const HabitsHeatmap = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await API.get("/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load habits");
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  if (loading) return <p>Loading habits...</p>;
  if (error) return <p>{error}</p>;

  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - 5);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const mapLogsToHeatmapValues = (logs) =>
    logs.map((log) => {
      let count = 0;
      switch (log.status) {
        case "not completed":
          count = 1;
          break;
        case "partially completed":
          count = 2;
          break;
        case "completed":
          count = 3;
          break;
        default:
          count = 0;
      }
      const date = parse(log.date, "yyyy-MM-dd", new Date());
      const adjustedDate = addDays(date, 1); // Shift date forward by one day
      const localDateString = format(adjustedDate, "yyyy-MM-dd");
      return { date: localDateString, count };
    });

  const classForValue = (value) => {
    if (!value) return "color-unspecified";
    if (value.count === 1) return "color-not-completed";
    if (value.count === 2) return "color-partial";
    if (value.count === 3) return "color-completed";
    return "color-unspecified";
  };

  // Custom month labels to show short names
  const monthLabels = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Helper: highlight if date is in current month
  const isCurrentMonth = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Render month label above first day of each month
  const transformDayElement = (element, value, index) => {
    if (!value || !value.date) return element;
    const date = new Date(value.date);
    // Only add label for first Sunday of the month (start of week)
    if (date.getDate() <= 7 && date.getDay() === 0) {
      return (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: -20,
              left: 0,
              fontWeight: "bold",
              color: "#444",
            }}
          >
            {monthLabels[date.getMonth() + 1]}
          </div>
          {element}
        </div>
      );
    }
    return element;
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading habits...</p>
        <style>
          {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }`}
        </style>
      </div>
    );
  

  return (
    <div className="habit-streaks-card">
      <h3 style={{ color: "#000", marginTop: 20 }}>
        📅 Habit Completion Heatmaps
      </h3>
      {habits.map((habit) => (
        <div key={habit._id} style={{ marginBottom: "1rem" }}>
          <h3 style={{ color: "#000" }}>{habit.name}</h3>
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={mapLogsToHeatmapValues(habit.logs)}
            classForValue={(value) => {
              const baseClass = classForValue(value);
              // Add highlight if date is in current month
              if (value && isCurrentMonth(value.date)) {
                return `${baseClass} current-month`;
              }
              return baseClass;
            }}
            showWeekdayLabels={true}
            transformDayElement={transformDayElement}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) return {};
              return {
                title: `${value.date}: ${value.status || "Unspecified"}`,
              };
            }}
          />
        </div>
      ))}
      <style>{`
        .color-unspecified { fill: #ebedf0; }
        .color-not-completed { fill: #f44336; }
        .color-partial { fill: #ff9800; }
        .color-completed { fill: #4caf50; }
      `}</style>
    </div>
  );
};

export default HabitsHeatmap;
