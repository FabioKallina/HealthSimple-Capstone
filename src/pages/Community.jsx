import React, { useState, useEffect } from "react";

import "../css/Community.css";
import API from "../services/communityServices.js/friendAPI.js";
import challengesAPI from "../services/communityServices.js/challengesAPI.js";

import { Link } from "react-router-dom";

import avatar1 from "../images/profile-images/default-profile.jpg";
import avatar2 from "../images/profile-images/lion.jpg";
import avatar3 from "../images/profile-images/cheetah.jpg";
import avatar4 from "../images/profile-images/jaguar.jpg";
import avatar5 from "../images/profile-images/panther.jpg";
import avatar6 from "../images/profile-images/tiger.jpg";
import avatar7 from "../images/profile-images/snow-leopard.jpg";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7];

const Community = () => {
  //const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [searchFriends, setSearchFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(res.data.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };

    fetchFriends();
  }, []);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await challengesAPI.get("/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched challenges:", res.data.data);
      setChallenges(res.data.data);
    } catch (e) {
      console.error("Failed fetching challenges", e);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoinChallenge = async (challenge) => {
    console.log("Joining challenge with data:", { challengeId: challenge._id });
    try {
      console.log("Joining challenge with:", { challengeId: challenge._id });
      const token = localStorage.getItem("token");
      await challengesAPI.post(
        "/join",
        { challengeId: challenge._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchChallenges();
    } catch (err) {
      console.error("Error joining challenge", err);
    }
  };

  const handleMarkChallengeComplete = async (challengeId) => {
    try {
      const token = localStorage.getItem("token");
      await challengesAPI.patch(
        `/${challengeId}/done`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect completion
      setChallenges((prev) =>
        prev.map((c) =>
          c._id === challengeId
            ? {
                ...c,
                completed: true,
                usersCompleted: (c.usersCompleted || 0) + 1,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to mark challenge complete", err);
    }
  };

  const handleSearchFriend = async (e) => {
    e.preventDefault();
    if (friendName.trim() === "") return;

    try {
      const token = localStorage.getItem("token");

      // Search registered users by name (change API baseURL accordingly)
      const res = await API.get(`/search?q=${friendName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchedUsers = res.data.data;
      if (matchedUsers.length === 0) {
        alert("No registered user found with that name.");
        return;
      }

      // If multiple users found, you could show them to choose (optional)
      // Here we pick the exact match or first match
      const exactMatch =
        matchedUsers.find(
          (u) => u.name.toLowerCase() === friendName.toLowerCase()
        ) || matchedUsers[0];

      // Now, add this user as a friend by user id (assuming your backend accepts userId)
      const addRes = await API.post(
        "/",
        { friendId: exactMatch._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFriends((prev) => [...prev, addRes.data.data]);
      setFriendName("");
    } catch (error) {
      console.error("Error searching/adding friend:", error);
    }
  };

  return (
    <div className="community-container">
      <h2>Community</h2>

      {/* Friends Section */}
      <section className="friends-section">
        <h3>Your Friends</h3>
        <button
          className="add-friends-btn"
          onClick={() => setSearchFriends(!searchFriends)}
        >
          +
        </button>

        {searchFriends && (
          <form className="friends-form" onSubmit={handleSearchFriend}>
            <input
              type="text"
              placeholder="Search for friends"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <button className="search-friends-btn">Add</button>
          </form>
        )}

        {friends.length === 0 ? (
          <p>No friends yet. Add Some!</p>
        ) : (
          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend._id || friend.id} className="friend-card">
                <div>
                  <div className="friend-avatar">
                  <img
                    src={avatars[friend.avatarIndex ?? 0]}
                    alt="Friend Avatar"
                    className="friend-avatar"
                  />
                  </div>
                  <p className="friend-name">
                    <Link to={`/friends/${friend._id}`}>{friend.name}</Link>
                  </p>
                  <p
                    className={`friend-status ${
                      friend.status ? friend.status.toLowerCase() : ""
                    }`}
                  >
                    {friend.status || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Challenges Section */}
      <section className="challenges-section">
        <h3>Weekly and Monthly Challenges</h3>
        <div className="challenges-list">
          {challenges.length === 0 ? (
            <p>Loading challenges...</p>
          ) : (
            challenges.map((challenge) => {
              const completed = challenge.completed || false;
              const joined = challenge.joined || false;

              return (
                <div key={challenge._id} className="challenge-card">
                  <p>{challenge.title}</p>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: completed ? "100%" : "0%" }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {completed
                      ? "Completed!"
                      : joined
                      ? "In Progress"
                      : "Not Joined"}
                  </p>

                  <button
                    className={`complete-btn ${completed ? "completed" : ""}`}
                    disabled={!joined || completed}
                    onClick={() => handleMarkChallengeComplete(challenge._id)}
                  >
                    {completed ? "Completed" : "Mark as Completed"}
                  </button>

                  <button
                    className="join-btn"
                    onClick={() => handleJoinChallenge(challenge)}
                    disabled={joined}
                  >
                    {joined ? "Joined" : "Join Challenge"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Community;
