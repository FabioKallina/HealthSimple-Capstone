
import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, default: Date.now },
    mood: { type: String },
    journal: { type: String },
});

const CheckIn = mongoose.model("CheckIn", checkinSchema);
export default CheckIn;