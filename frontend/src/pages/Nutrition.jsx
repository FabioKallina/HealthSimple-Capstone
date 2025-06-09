import React, { useState, useEffect } from "react";
import DateNavigator from "../components/DateNavigator";
import NutritionCard from "../components/NutritionCard";
import FoodSearchPopup from "../components/FoodSearchPopup";
import NutritionPieChart from "../components/NutritionPieChart";

import "../css/Nutrition.css";
import nutritionAPI from "../services/nutritionAPI";

const getLocalDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset(); // in minutes
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const Nutrition = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getLocalDateString);

  const [loggedFoods, setLoggedFoods] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: [],
    Water: [],
  });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await nutritionAPI.get(`/?date=${selectedDate}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const foods = res.data.data;

        const groupedFoods = {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snack: [],
          Water: [],
        };

        foods.forEach(food => {
          if (groupedFoods[food.meal]) {
            groupedFoods[food.meal].push(food)
          }
        });

        setLoggedFoods(groupedFoods);

      } catch (e) {
        console.error("Failed fetching foods", e);
      }
    };
    fetchFoods();
  }, [selectedDate]);

  const handleAddFood = async (food) => {
    if (!selectedMeal) return;

    const foodToSend = {
      foodId: food.foodId,
      name: food.label,
      quantity: food.quantity,
      calories: food.nutrients.ENERC_KCAL,
      protein: food.nutrients.PROCNT,
      carbs: food.nutrients.CHOCDF,
      fat: food.nutrients.FAT,
      meal: selectedMeal,
      date: selectedDate,
    };

    console.log("Sending to backend:", foodToSend);

    try {
      const token = localStorage.getItem("token");
      const res = await nutritionAPI.post("/", foodToSend, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });

      setLoggedFoods((prev) => ({
        ...prev,
        [selectedMeal]: [...prev[selectedMeal], res.data.data],
      }));

      setIsPopupOpen(false);

    } catch (e) {
      console.error("Failed creating food", e);
    }
  };

  const handleDeleteFood = async (meal, indexToDelete) => {
    const foodToDelete = loggedFoods[meal][indexToDelete];

    if (!foodToDelete) {
      console.error("Could not find food item to delete");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await nutritionAPI.delete(`/${foodToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLoggedFoods((prev) => ({
        ...prev,
        [meal]: prev[meal].filter((_, index) => index !== indexToDelete),
      }));
    } catch (e) {
      console.error("Failed to delete food item", e);
    }
  };

  return (
    <div className="nutrition-container">
      <DateNavigator selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <NutritionPieChart
        foods={[
          ...loggedFoods.Breakfast,
          ...loggedFoods.Lunch,
          ...loggedFoods.Dinner,
          ...loggedFoods.Snack,
        ]}
      />

      {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
        <NutritionCard
          key={meal}
          title={meal}
          onAdd={() => {
            setIsPopupOpen(true);
            setSelectedMeal(meal);
          }}
          foods={loggedFoods[meal]}
          onDeleteFood={(index) => handleDeleteFood(meal, index)}
        />
      ))}

      {isPopupOpen && (
        <FoodSearchPopup
          onClose={() => setIsPopupOpen(false)}
          onAddFood={handleAddFood}
        />
      )}
    </div>
  );
};

export default Nutrition;
