import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import "../css/NutritionPieChart.css";

ChartJS.register(ArcElement, Legend, Tooltip);

const NutritionPieChart = ({ foods }) => {
  const totals = foods.reduce(
    (acc, food) => {
      const multiplier = food.quantity / 100;
      acc.protein += (food.protein || 0) * multiplier;
      acc.carbs += (food.carbs || 0) * multiplier;
      acc.fat += (food.fat || 0) * multiplier;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const data = {
    labels: ["Protein", "Carbs", "Fats"],
    datasets: [
      {
        data: [totals.protein, totals.carbs, totals.fat],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  const totalCalories = foods.reduce((sum, food) => {
    return sum + (food.calories || 0) * (food.quantity / 100);
  }, 0);

  if (totalCalories === 0) return null;

  return (
    <div
      className="pie-chart-display"
    >
      <h3 style={{ color: "#000" }}>Macronutrients Breakdown</h3>
      <Pie data={data} />
      <h2 style={{ color: "#000" }}>Total Calories: {totalCalories.toFixed(0)}kcal</h2>
    </div>
  );
};

export default NutritionPieChart;
