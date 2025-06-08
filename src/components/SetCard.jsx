import React, { useEffect, useState } from 'react'

import "../css/SetCard.css"

const SetCard = ({ exercise, onUpdateSets, onRemove }) => {

    const [sets, setSets] = useState([
        { id: Date.now(), weight: "", reps: "", completed: false }
    ]);

    const handleConfirmSet = (index) => {
        const updatedSets = [...sets];
        updatedSets[index].completed = !updatedSets[index].completed;
        setSets(updatedSets);
    }

    const handleDeleteSet = (index) => {
        const updatedSets = sets.filter((_, i) => i !== index );
        setSets(updatedSets);
    }

    const handleAddSet = () => {
        setSets((prevSets) => [
            ...prevSets,
            { id: Date.now(), weight: "", reps: "", completed: false }
        ])
    }

    const handleChange = (index, field, value) => {
        const updatedSets = [...sets];
        updatedSets[index][field] = value;
        setSets(updatedSets);
    }

    useEffect(() => {
        onUpdateSets && onUpdateSets(sets)
    }, [sets]);

  return (
    <div className="set-overlay">
        <h2>{exercise.name}</h2>

        {sets.map((set, index) => (
            <div className={`setRow ${set.completed ? "completed" : "" }`}>
                <div className="input-pair">
                    <div className="set-number">
                        <h3>{index + 1}</h3>
                    </div>

                    <div className="input-group">
                        <label>lbs</label>
                        <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleChange(index, "weight", e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>reps</label>
                        <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleChange(index, "reps", e.target.value)}
                        />
                    </div>

                    <div className="btn-container"> 
                        <button className="done" onClick={() => handleConfirmSet(index)}>✔</button>
                        <button className="cancel" onClick={() => handleDeleteSet(index)}>✘</button>
                    </div>
                </div>
            </div>
        ))}

        <div className="exercise-btns-container">
            <button className="add-set-btn" onClick={handleAddSet}>+ Add Set</button>
            <button className="remove-btn" onClick={onRemove}>Remove Exercises</button>
        </div>
    </div>
  )
}

export default SetCard