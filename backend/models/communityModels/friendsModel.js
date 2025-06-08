
import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String },
    name: { type: String, required: true },
}, { timestamps: true });

const Friends = mongoose.model("Friends", friendsSchema);
export default Friends