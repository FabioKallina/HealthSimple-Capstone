import React, { useState } from "react";

import "../css/DateNavigator.css";

const DateNavigator = ({ selectedDate, setSelectedDate }) => {
  // Helper to parse date without timezone shift
  const parseDateWithoutTimezone = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  const displayDate = parseDateWithoutTimezone(selectedDate);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const formatted = newDate.toISOString().split("T")[0];
    setSelectedDate(formatted);
  };
  return (
    <div className="date-navigator">
      <button className="arrow-btn" onClick={() => changeDate(-1)}>
        {"<"}
      </button>
      <span className="date-display">{formatDate(displayDate)}</span>
      <button className="arrow-btn" onClick={() => changeDate(1)}>
        {">"}
      </button>
    </div>
  );
};

export default DateNavigator;
