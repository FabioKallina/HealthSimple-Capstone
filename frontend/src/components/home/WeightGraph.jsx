import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../../services/weightAPI.js";

import "../../css/weightGraph.css";

const weightGraph = () => {
  const [weightData, setWeightData] = useState([]);
  const [todaysWeight, setTodaysWeight] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchWeight = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.get("/api/weight", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //filter data for the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const filtered = res.data.data
        .filter((entry) => new Date(entry.date) >= threeMonthsAgo)
        .map((entry) => ({
          date: entry.date,
          weight: entry.weight,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setWeightData(filtered);
      setLoading(false);
    } catch (e) {
      console.error("Failed fetching weight data", e);
      setLoading(false);
    }
  };

  const handleSubmitWeight = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const today = new Date().toISOString().split("T")[0];

    try {
      await API.post(
        "/api/weight",
        { date: today, weight: parseFloat(todaysWeight) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodaysWeight("");
      fetchWeight(); //refresh graph
    } catch (e) {
      console.error("Failed adding weight", e);
    }
  };

  useEffect(() => {
    fetchWeight();
  }, []);

  return (
    <div className="weight-card">
      <h3 style={{ color: "#000" }}>Weight Tracker</h3>

      <form onSubmit={handleSubmitWeight} className="weight-form">
        <input
          type="number"
          placeholder="Enter your weight"
          step="0.1"
          value={todaysWeight}
          onChange={(e) => setTodaysWeight(e.target.value)}
          required
        />
        <button className="weight-btn" type="submit">
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer height={400} width="100%">
          <AreaChart
            data={weightData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              label={{
                value: "Weight (lbs)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                style: { textAnchor: "middle", fill: "#000" },
              }}
            />
            <Tooltip />
            <Area
              type="linear"
              dataKey="weight"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorWeight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default weightGraph;
