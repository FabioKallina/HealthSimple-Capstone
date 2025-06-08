import mongoose from "mongoose";
import Friends from "../../models/communityModels/friendsModel.js";
import User from "../../models/userModel.js";
import Profile from "../../models/profileModel.js";
import Workout from "../../models/workoutModel.js";
import Challenge from "../../models/communityModels/challengesModel.js";

//Get friends
export const getAllFriends = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const friends = await Friends.find({ userId: currentUserId }).populate(
      "friendId",
      "name status"
    );
    
    res.status(200).json({ status: "success", data: friends });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch friends",
      error: error.message,
    });
  }
};

//Search for a friend
export const searchFriend = async (req, res) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user.id;

    let friends;
    if (search) {
      const regex = new RegExp(search, "i");
      friends = await Friends.find({ userId: currentUserId, name: regex });
    } else {
      friends = await Friends.find({ userId: currentUserId });
    }

    res.status(200).json({ status: "success", data: friends });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to search for friend",
      error: error.message,
    });
  }
};

//Add friend
export const addFriend = async (req, res) => {
  try {
    console.log("Request user:", req.user);
    const currentUserId = req.user.id;
    const { friendId } = req.body;
    console.log("friendId:", friendId);

    if (!friendId) {
      return res
        .status(400)
        .json({ status: "error", message: "friendId is required" });
    }

    // Check if userId exists
    const userToAdd = await User.findById(friendId);
    if (!userToAdd) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Check if already friends
    const alreadyFriend = await Friends.findOne({
      userId: currentUserId,
      friendId,
    });
    if (alreadyFriend) {
      return res
        .status(400)
        .json({ status: "error", message: "Already friends" });
    }

    //define current user
    const currentUser = await User.findById(currentUserId);
    // Create friend link
    const newFriend = await Friends.create([
      {
        userId: currentUserId,
        friendId,
        status: userToAdd.status || "Offline",
        name: userToAdd.name, // name of the person you're adding
      },
      {
        userId: friendId,
        friendId: currentUserId,
        status: currentUser.status || "Offline",
        name: currentUser.name, // your own name, for the other person's list
      },
    ]);

    res.status(201).json({ status: "success", data: newFriend });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to add friend",
      error: error.message,
    });
  }
};

//Search for existing users
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res
        .status(400)
        .json({ status: "error", message: "Query missing" });

    const regex = new RegExp(q, "i");
    const users = await User.find({ name: regex }).select("name _id"); // select fields you want

    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to search users",
      error: error.message,
    });
  }
};

//Get a friend's profile by friendId
export const getFriendProfile = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { friendId } = req.params; // this is friendship _id here

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ID format" });
    }

    // Get friendship document by _id
    const friendship = await Friends.findById(friendId);
    if (!friendship) {
      return res
        .status(404)
        .json({ status: "error", message: "Friendship not found" });
    }

    // Check current user is part of friendship
    if (
      friendship.userId.toString() !== currentUserId &&
      friendship.friendId.toString() !== currentUserId
    ) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    // Find the other user's ID (the friend)
    const friendUserId =
      friendship.userId.toString() === currentUserId
        ? friendship.friendId
        : friendship.userId;

    const friendUser = await User.findById(friendUserId).select("-password");
    if (!friendUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Fetch additional profile info from other collections
    const profile = (await Profile.findOne({ userId: friendUserId })) || {};
    const workoutsCount = await Workout.countDocuments({
      userId: friendUserId,
    });
    const friendsCount = await Friends.countDocuments({ userId: friendUserId });
    const challengesCount = await Challenge.countDocuments({
      userId: friendUserId,
    });

    const friendProfile = {
      name: friendUser.name,
      status: friendUser.status,
      bio: profile.bio || "No bio available",
      goals: profile.goals || [],
      avatarIndex: profile.avatarIndex ?? 0,
      workoutsCount,
      friendsCount,
      challengesCount,
    };

    res.status(200).json({ status: "success", data: friendProfile });
  } catch (error) {
    console.error("Error fetching friend profile:", error);
    res
      .status(500)
      .json({ status: "error", message: "Server error", error: error.message });
  }
};
