import React, { useEffect, useState } from 'react'

import "../css/Mindfulness.css"

const affirmations = [
    "You are enough.",
    "Peace begins with you.",
    "You are doing your best.",
    "Inhale confidence, exhale doubt.",
    "You are worthy of love and respect.",
    "You are growing stronger every day.",
    "Your mind is calm, your body is relaxed.",
    "You are in control of your thoughts and emotions.",
    "You radiate positivity and kindness.",
    "Every day is a fresh start.",
    "You are proud of how far you’ve come.",
    "You are safe, you are grounded, you are whole.",
    "You choose peace over worry.",
    "You trust yourself to make the right decisions.",
    "You are resilient, brave, and strong.",
    "You deserve rest, love, and happiness.",
    "You allow yourself to slow down and breathe.",
    "You are aligned with the energy of peace.",
    "You bring value to the world.",
    "You are exactly where you need to be."
  ];

const Mindfulness = () => {

    const [breathPhase, setBreathPhase] = useState("Inhale");
    const [affirmation, setAffirmation] = useState("");
    const [timer, setTimer] = useState(0);
    const [isTiming, setIsTiming] = useState(false);

    //breathing loop
    useEffect(() => {
        const interval = setInterval(() => {
            setBreathPhase((prev) => (prev === "Inhale" ? "Exhale" : "Inhale"))
        }, 5000); //5 second phases
        return () => clearInterval(interval);
    }, []);

    //timer logic
    useEffect(() => {
        let countdown;
        if ( isTiming && timer > 0 ) {
            countdown = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000)
        } else if ( timer === 0 && isTiming ) {
            setIsTiming(false);
        }
        return () => clearInterval(countdown);
    }, [isTiming, timer]);

    const startTimer  = (minutes) => {
        setTimer(minutes * 60);
        setIsTiming(true);
    }

    const formatTimer = (seconds) => {
        let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        let secs = String(seconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    }

  return (
    <div className="mindfulness-container">
        <h2>Mindfulness Exercises</h2>

        {/*Breathing Prompt*/}
        <div className="breathing-container">
            <h3>Breathing Exercise</h3>
            <div className="breath-display">
                {breathPhase}
            </div>
        </div>

        {/*Affirmation Generator*/}
        <div className="affirmation-container">
            <h3>Daily Affirmation</h3>
            <p>{affirmation || "Click below for an affirmation"}</p>
            <button
            onClick={() => {
                const random = affirmations[Math.floor(Math.random() * affirmations.length)];
                setAffirmation(random);
            }}
                className="affirmation-btn"
            >
                Get Affirmation
            </button>
        </div>

        {/*Meditation Timer*/}
        <div className="meditation-container">
            <h3>Meditation Timer</h3>
            {isTiming ? (
                <div className="meditation-timer">{formatTimer(timer)}</div>
            ) : (
                <div className="timer-display">
                    {[1, 3, 5, 10].map((min) => (
                        <button
                            key={min}
                            onClick={() => startTimer(min)}
                            className="meditation-timer-btn"
                        >
                            {min} min
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default Mindfulness