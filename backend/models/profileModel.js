
import mongoose from "mongoose";

const goalsSchema = new mongoose.Schema({
    goal: { type: String },
})

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bio: { type: String, required: true },
    goals: [goalsSchema],
    avatarIndex: { type: Number, default: 0 },
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;