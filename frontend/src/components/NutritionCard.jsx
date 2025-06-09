import React from "react";

import "../css/NutritionCard.css";

const NutritionCard = ({ title, onAdd, foods = [], onDeleteFood }) => {
  const totalCalories = foods
    .reduce((sum, food) => {
      return sum + (food.calories || 0) * (food.quantity / 100);
    }, 0)
    .toFixed(0);

  return (
    <div className="nutrition-card">
      <div className="nutrition-card-header">
        <h3>{title}:</h3>
        {foods.length > 0 && (
          <div className="meal-calories">{totalCalories} kcal</div>
        )}
      </div>

      <div className="logged-food-list">
        {foods.map((food, index) => (
          <div key={index} className="food-logged">
            <h3>
              {food.name} - {food.quantity}g:
            </h3>
            <p>
              {food.calories
                ? ((food.calories * food.quantity) / 100).toFixed(0)
                : "?"}
              kcal
            </p>
            <p>
              {food.protein
                ? ((food.protein * food.quantity) / 100).toFixed(0)
                : "?"}{" "}
              g of protein
            </p>
            <p>
              {food.fat
                ? ((food.fat * food.quantity) / 100).toFixed(0)
                : "?"}{" "}
              g of fats
            </p>
            <p>
              {food.carbs
                ? ((food.carbs * food.quantity) / 100).toFixed(0)
                : "0"}{" "}
              g of carbs
            </p>

            <button onClick={() => onDeleteFood(index)} className="remove-food-btn">❌</button>
          </div>
        ))}
      </div>

      <button onClick={onAdd} className="add-food-btn">
        ADD ITEM
      </button>
    </div>
  );
};

export default NutritionCard;
