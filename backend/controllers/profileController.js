import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";

//Get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching profile for userId:", userId);

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      console.log("No profile found for:", userId);
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, goals, avatarIndex } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (goals) updateFields.goals = goals;
    if (typeof avatarIndex === "number") updateFields.avatarIndex = avatarIndex;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found to be updated",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

//Delete user and profile
export const deleteUser = async ( req, res ) => {

  try {

    const userId = req.user.id;

    // Delete profile and user (and other data like workouts or friends)
    await Profile.findOneAndDelete({ userId });
    await User.findOneAndDelete(userId);

    res.status(200).json({ status: "success", message: "Deleted User"})

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
      error: error.message
    });
  }
}
