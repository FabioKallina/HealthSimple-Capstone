import React, { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  YAxis,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../../services/api.js";

const WorkoutStats = () => {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchWorkoutStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await API.get("/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const workouts = res.data.data;

        // Step 1: Generate the past 4 weeks
        const pastWeeks = [];
        const today = new Date();
        for (let i = 3; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i * 7);
          const year = date.getFullYear();
          const week = getWeekNumber(date);
          const startOfWeek = getStartOfWeek(date); // e.g. Mon of that week
          const label = startOfWeek.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          pastWeeks.push({ key: `${year}-W${week}`, label });
        }

        // Step 2: Count workouts per week
        const weeklyCounts = {};
        pastWeeks.forEach((w) => (weeklyCounts[w.key] = 0)); // initialize with 0

        workouts.forEach((w) => {
          const date = new Date(w.date);
          const year = date.getFullYear();
          const week = getWeekNumber(date);
          const key = `${year}-W${week}`;
          if (weeklyCounts.hasOwnProperty(key)) {
            weeklyCounts[key]++;
          }
        });

        // Step 3: Format for chart
        const formatted = pastWeeks.map((w) => ({
          week: w.label, // show 'Jun 2' etc
          workouts: weeklyCounts[w.key],
        }));

        setWeeklyData(formatted);
      } catch (e) {
        console.error("Failed to fetch Workout Stats", e);
      }
    };

    fetchWorkoutStats();
  }, []);

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
    return new Date(d.setDate(diff));
  };

  return (
    <div className="workout-stats-card">
      <h3 style={{ color: "#000" }}>Weekly Workout Tracker</h3>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={weeklyData} borderRadius={10}>
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="workouts" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutStats;
