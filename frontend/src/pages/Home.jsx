import React, { useState, useEffect } from "react";

import "../css/Home.css";

import NutritionPieChart from "../components/NutritionPieChart";
import WorkoutStats from "../components/home/WorkoutStats";

import nutritionAPI from "../services/nutritionAPI";

import WaterTracker from "../components/home/WaterTracker";
import HabitsStreak from "../components/home/HabitsStreak";
import StepsBarGraph from "../components/home/StepsBarGraph";
import WeightGraph from "../components/home/weightGraph";

const getLocalDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset(); // in minutes
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(getLocalDateString);

  const [loggedFoods, setLoggedFoods] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: [],
    Water: [],
  });
  //Fetching food items for Food Pie Chart Display
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await nutritionAPI.get(`/api/nutrition/?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const foods = res.data.data;

        const groupedFoods = {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snack: [],
          Water: [],
        };

        foods.forEach((food) => {
          if (groupedFoods[food.meal]) {
            groupedFoods[food.meal].push(food);
          }
        });

        setLoggedFoods(groupedFoods);
      } catch (e) {
        console.error("Failed fetching foods", e);
      }
    };
    fetchFoods();
  }, [selectedDate]);

  return (
    <div className="home-container">

      <div className="nutrition-pie-chart">
        <NutritionPieChart
          foods={[
            ...loggedFoods.Breakfast,
            ...loggedFoods.Lunch,
            ...loggedFoods.Dinner,
            ...loggedFoods.Snack,
          ]}
        />
      </div>

      <WorkoutStats />

      <WaterTracker />

      <HabitsStreak />

      <StepsBarGraph />

      <WeightGraph />
    </div>
  );
};

export default Home;
