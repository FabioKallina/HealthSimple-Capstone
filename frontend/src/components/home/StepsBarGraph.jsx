// components/StepsBarGraph.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import API from "../../services/stepsAPI.js";

import "../../css/StepsBarGraph.css";

const StepsBarGraph = () => {

  const [stepsData, setStepsData] = useState([]);
  const [todaySteps, setTodaySteps] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSteps = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.get("/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //Sort by date and take the most recent 7 entries
      const sorted = res.data.data.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
      console.log("Fetched Steps Data:", sorted);


      setStepsData(sorted);
      setLoading(false);
    } catch (e) {
      console.error("Failed to fetch steps", e);
      setLoading(false);
    }
  }

  const handleSubmitSteps = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const today = new Date().toISOString().split("T")[0];

    try {
      await API.post("/", 
        { date: today, steps: parseInt(todaySteps, 10) }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodaySteps("");
      fetchSteps(); //refresh Data
    } catch (e) {
      console.error("Failed submitting steps", e)
    }
  }

  useEffect(() => {
    fetchSteps();
  }, [])

  return (
    <div className="steps-graph-container">
      <h3 style={{ color: "#000" }}>Steps Tracker</h3>
      
      <form className="steps-form" onSubmit={handleSubmitSteps}>
        <input
          type="text"
          placeholder="Steps for today"
          value={todaySteps}
          onChange={(e) => setTodaySteps(e.target.value)}  
          required   
        />
        <button className="add-steps-btn" stype="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ResponsiveContainer height={400} width="100%">
          <BarChart data={stepsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis label={{ value: "Steps", angle: -90, position: "insideLeft" }} />
            <XAxis dataKey="date"  />
            <Tooltip />
            <Bar dataKey="steps" fill="#db342a" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StepsBarGraph;
