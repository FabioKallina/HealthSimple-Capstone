import React, { useEffect, useState } from "react";
import "../css/Profile.css";

import API from "../services/api.js";
import friendAPI from "../services/communityServices.js/friendAPI.js";
import profileAPI from "../services/profileAPI.js";

import avatar1 from "../images/profile-images/default-profile.jpg";
import avatar2 from "../images/profile-images/lion.jpg";
import avatar3 from "../images/profile-images/cheetah.jpg";
import avatar4 from "../images/profile-images/jaguar.jpg";
import avatar5 from "../images/profile-images/panther.jpg";
import avatar6 from "../images/profile-images/tiger.jpg"
import avatar7 from "../images/profile-images/snow-leopard.jpg";


const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7];

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Profile = () => {
  const [bio, setBio] = useState("I love lifting and taking care of my body");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [goals, setGoals] = useState(["Run 10km", "Stick to meal prep"]);
  const [editingGoals, setEditingGoals] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);

  //Get workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/workout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserWorkouts(res.data.data || []);
      } catch (e) {
        console.error("Failed fetching workouts", e);
      }
    };
    fetchWorkouts();
  }, []);

  //Get friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await friendAPI.get("/api/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(res.data.data);
      } catch (e) {
        console.error("Failed fetching friends", e);
      }
    };
    fetchFriends();
  }, []);

  //Get profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await profileAPI.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, bio, goals, avatarIndex } = res.data;
        setName(name);
        setBio(bio);
        setGoals(goals ? goals.map((g) => g.goal) : []);
        setAvatarIndex(avatarIndex || 0);
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        name,
        bio,
        avatarIndex,
        goals: goals.map((g) => ({ goal: g })),
      };
      const res = await profileAPI.put("/api/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing(false);
      setEditingGoals(false);
    } catch (e) {
      console.error("Failed saving profile", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  if (!loggedIn) {
    return (
      <div className="profile-container">
        <p>
          Please <a href="/login">log in</a> to view your profile.
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await profileAPI.delete("/api/profile/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        alert("Account deleted successfully.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (e) {
      console.error("Failed to delete account", e);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-display">
        <img src={avatars[avatarIndex]} className="profile-img" />

        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-input"
            />
            <button onClick={saveProfile} className="save-profile-btn">
              Save
            </button>

            <div className="avatar-selection">
              <p>Select Your Avatar:</p>
              <div className="avatar-options">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index}`}
                    className={`avatar-option ${
                      avatarIndex === index ? "selected" : ""
                    }`}
                    onClick={() => setAvatarIndex(index)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="profile-name">{name}</h1>
            <p className="profile-bio">{bio}</p>
            <button
              onClick={() => setEditing(true)}
              className="edit-profile-btn"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="profile-stats">
        <h3>Stats</h3>
        <p>🏋️ {userWorkouts.length} Workouts</p>
        <p>👥 {friends.length} Friends</p>
      </div>

      <div className="profile-goals">
        <h3>Your Goals</h3>
        {editingGoals ? (
          <div className="edit-goals-container">
            <ul className="edit-goals-list">
              {goals.map((goal, index) => (
                <li key={index}>
                  🎯{" "}
                  <input
                    value={goal}
                    onChange={(e) => {
                      const updatedGoals = [...goals];
                      updatedGoals[index] = e.target.value;
                      setGoals(updatedGoals);
                    }}
                    className="goal-input"
                  />
                  <button
                    onClick={() => {
                      const updatedGoals = goals.filter((_, i) => i !== index);
                      setGoals(updatedGoals);
                    }}
                    className="goal-delete-btn"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
            <input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="New goal"
              className="new-goal-input"
            />
            <button
              onClick={() => {
                if (newGoal.trim()) {
                  setGoals([...goals, newGoal.trim()]);
                  setNewGoal("");
                }
              }}
              className="add-goal-btn"
            >
              ➕ Add Goal
            </button>
            <button onClick={saveProfile} className="confirm-goal-btn">
              ✅ Done
            </button>
          </div>
        ) : (
          <div>
            <ul>
              {goals.map((goal, index) => (
                <li key={index}>🎯 {goal}</li>
              ))}
            </ul>
            <button
              onClick={() => setEditingGoals(true)}
              className="edit-goal-btn"
            >
              ✏️ Edit Goals
            </button>
          </div>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Log Out
      </button>

      <button
        className="delete-account-btn"
        onClick={() => setDeletePopUp(true)}
      >
        Delete Account
      </button>

      {deletePopUp && (
        <div className="delete-popup">
          <h3 style={{ color: "#000" }}>Are you sure you want to delete?</h3>
          <p>You cannot undo this action</p>
          <button className="confirm-delete-btn" onClick={handleDeleteAccount}>
            Confirm Delete
          </button>
          <button className="cancel-btn" onClick={() => setDeletePopUp(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
