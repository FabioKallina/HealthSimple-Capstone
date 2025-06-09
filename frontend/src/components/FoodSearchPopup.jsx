import React, { useState } from "react";
import "../css/FoodSearchPopup.css";

const APP_ID = import.meta.env.VITE_API_ID;
const APP_KEY = import.meta.env.VITE_APP_KEY;

const FoodSearchPopup = ({ onClose, onAddFood }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manual, setManual] = useState({
    label: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const searchFood = async () => {
    try {
      const res = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      const data = await res.json();
      setResults(data.hints || []);
    } catch (e) {
      console.error("Error fetching foods", e);
    }
  };

  return (
    <div className="food-popup-overlay">
      <div className="food-popup-content">
        <button onClick={onClose} className="food-close-btn">X</button>
        <input
          type="text"
          placeholder="Search for a food"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="food-search-btn" onClick={searchFood}>
          Search
        </button>

        <button className="manual-btn" onClick={() => setShowManualForm(true)}>
          + Manual Entry
        </button>

        <div className="food-list">
          {results.map((item, index) => {
            const food = item.food;
            const calories = food.nutrients.ENERC_KCAL;
            const protein = food.nutrients.PROCNT;
            const carbs = food.nutrients.CHOCDF;
            const fats = food.nutrients.FAT;

            return (
              <div
                key={index}
                className="food-item"
                onClick={() => setSelectedFood(food)}
              >
                <div className="food-info">
                  <p><strong>{food.label}</strong></p>
                  <p className="calories-text">
                    Calories:{" "}
                    {calories ? `${calories} kcal per 100g` : "No calorie data"}
                  </p>
                </div>
                <button
                  onClick={() => onAddFood({ ...food, quantity: 100 })}
                  className="add-item-btn"
                >
                  + Add
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal outside the map */}
        {selectedFood && (
          <div className="food-detail-modal">
            <h3>{selectedFood.label}</h3>
            <p>Calories: {selectedFood.nutrients.ENERC_KCAL} kcal per 100g</p>
            <p>Protein: {selectedFood.nutrients.PROCNT} g</p>
            <p>Carbs: {selectedFood.nutrients.CHOCDF} g</p>
            <p>Fat: {selectedFood.nutrients.FAT} g</p>

            <div className="food-submit">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter amount in grams"
            />
            <button
              onClick={() => {
                onAddFood({ ...selectedFood, quantity });
                setSelectedFood(null);
                setQuantity(100);
              }}
              className="food-confirm-btn"
            >
              Confirm Add
            </button>
            <button onClick={() => setSelectedFood(null)} className="food-cancel-btn">Cancel</button>
            </div>
          </div>
        )}

        {showManualForm && (
          <div className="manual-entry-form">
            <h3 style={{ color: "#000" }}>Manual Food Entry</h3>

            <input
              type="text"
              placeholder="Food name"
              value={manual.label}
              onChange={(e) => setManual({ ...manual, label: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity (g)"
              value={manual.quantity}
              onChange={(e) =>
                setManual({ ...manual, quantity: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Calories"
              value={manual.calories}
              onChange={(e) =>
                setManual({ ...manual, calories: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={manual.protein}
              onChange={(e) =>
                setManual({ ...manual, protein: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={manual.carbs}
              onChange={(e) =>
                setManual({ ...manual, carbs: Number(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Fat (g)"
              value={manual.fat}
              onChange={(e) =>
                setManual({ ...manual, fat: Number(e.target.value) })
              }
            />

            <div className="manual-entry-buttons">
              <button
                onClick={() => {
                  onAddFood({
                    label: manual.label,
                    quantity: manual.quantity,
                    nutrients: {
                      ENERC_KCAL: manual.calories,
                      PROCNT: manual.protein,
                      CHOCDF: manual.carbs,
                      FAT: manual.fat,
                    },
                  });
                  // Reset form and close
                  setManual({
                    label: "",
                    quantity: 100,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                  });
                  setShowManualForm(false);
                }}
                className="manual-entry-btn"
              >
                Add
              </button>
              <button onClick={() => setShowManualForm(false)} className="manual-entry-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSearchPopup;
