import React, { useState } from "react";

import "../css/ExerciseCard.css";

const ExerciseCard = ({ exercise }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="exercise-card" >
            <div>
                <img src={exercise.image} className="exercise-img"/>
            </div>
            <h2>{exercise.name}</h2>
            <button onClick={() => setShowInstructions(!showInstructions)} className="instructions-btn">
                {showInstructions ? "-" : "?"}
            </button>
            {showInstructions && (
                <p className="instructions"> {exercise.instructions || "No instructions available"}</p>
            )}
        </div>
  );
};

export default ExerciseCard;
