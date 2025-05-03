import mongoose from "mongoose";
import { Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, },
    profilePictureUrl: { type: String, default: "" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "House" }],
    pastViews: [{ type: Schema.Types.ObjectId, ref: "House" }],
    isVerified: { type: Boolean, default: false },
    housesPosted: [{ type: Schema.Types.ObjectId, ref: "House" }],
    orderHouse: [{ type: Schema.Types.ObjectId, ref: "OrderHouse" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;