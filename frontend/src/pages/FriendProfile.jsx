import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/communityServices.js/friendAPI.js";

import avatar1 from "../images/profile-images/default-profile.jpg";
import avatar2 from "../images/profile-images/lion.jpg";
import avatar3 from "../images/profile-images/cheetah.jpg";
import avatar4 from "../images/profile-images/jaguar.jpg";
import avatar5 from "../images/profile-images/panther.jpg";
import avatar6 from "../images/profile-images/tiger.jpg";
import avatar7 from "../images/profile-images/snow-leopard.jpg";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7];

const FriendProfile = () => {
  const { friendId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await API.get(`/api/friends/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data.data);
      } catch (e) {
        console.error("Failed to fetch friend's profile", e);
      }
    };
    fetchFriendProfile();
  }, [friendId]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-display">
        <img
          src={avatars[profile.avatarIndex ?? 0]}
          alt="Friend Avatar"
          className="profile-img"
        />
        <h1 className="profile-name">{profile.name || "No name"}</h1>
        <p className="profile-bio">{profile.bio || "No bio available."}</p>
      </div>

      <div className="profile-stats">
        <h3>Stats</h3>
        <p>🏋️ {profile.workoutsCount || 0} Workouts</p>
        <p>✅ {profile.challengesCount || 0} Challenges</p>
        <p>👥 {profile.friendsCount || 0} Friends</p>
      </div>

      <div className="profile-goals">
        <h3>Goals</h3>
        {profile.goals && profile.goals.length > 0 ? (
          <ul>
            {profile.goals.map((goal, index) => (
              <li key={index}>🎯 {goal.goal || goal}</li>
            ))}
          </ul>
        ) : (
          <p>No goals listed.</p>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;
