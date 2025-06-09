import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="/logo1.png" alt="Logo" className="logo-img" />
        <span className="logo-text">HealthSync</span>
      </div>

      <div
        className={`navbar-links ${isMenuOpen ? "open" : ""}`}
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <Link
          to="/"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/workout"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Workout
        </Link>
        <Link
          to="/nutrition"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Nutrition
        </Link>
        <Link
          to="/checkin"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Check In
        </Link>
        <Link
          to="/habits"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Habits
        </Link>
        <Link
          to="/community"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Community
        </Link>
        <Link
          to="/profile"
          className="navbar-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Profile
        </Link>
      </div>

      <div
        className="hamburger"
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default NavBar;

/**
 * import React, { useState } from 'react'
import { Link } from "react-router-dom";

import "../css/NavBar.css"

const NavBar = () => {
  return (
    <div className="navbar">
        <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/workout" className="navbar-link">Workout</Link>
            <Link to="/nutrition" className="navbar-link">Nutrition</Link>
            <Link to="/checkin" className="navbar-link">Check In</Link>
            <Link to="/habits" className="navbar-link">Habits</Link>
            <Link to="/community" className="navbar-link">Community</Link>
            <Link to="/profile" className="navbar-link">Profile</Link>
        </div>
    </div>
  )
}

export default NavBar

.navbar {
    background-color: #449a73;
    width: 100%;
    border-bottom: 2px solid #0077b6;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.navbar-links {
    display: flex;
    justify-content: space-evenly;
    padding: 10px;
}

.navbar-link {
    font-size: 1.5rem;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    transition: background-color 0.5s ease;
}

.navbar-link:hover {
    cursor: pointer;
}

.navbar-links a {
    font-weight: 500;
    color: aliceblue;
    text-decoration: inherit;
    transition: color 0.3s ease;
}

.navbar-links a:hover {
    color: #0077b6;
}  

*/
