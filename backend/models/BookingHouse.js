import mongoose from "mongoose";
import {Schema} from "mongoose";
const BookingHouseSchema = new Schema({
    houseId: {type: Schema.Types.ObjectId, ref: "House", required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    orderId: {type: String, required: true},
    paymentId: {type: String, required: true},
    signature: {type: String, required: true},
    status: {type: String, enum: ["pending", "completed", "canceled"], default: "completed"},
    paymentMethod: {type: String, enum: ["creditCard", "debitCard", "paypal"], default: "creditCard"},
});
const BookingHouse = mongoose.model("BookingHouse", BookingHouseSchema);
export default BookingHouse;