import mongoose from "mongoose";
const { Schema } = mongoose;
const houseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    imageUrl: { type: [String], required: true },
    area: { type: Number, required: true },
    numberOfBedrooms: { type: String, required: true },
    numberOfBathrooms: { type: String, required: true },
    type: { type: String, required: true },
    BookingStatus: { type: [String] },
    availableFor: { type: String, required: true },
    postedBy: { type: String, required: true },
    furnishingStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const House = mongoose.model("House", houseSchema);
export default House;