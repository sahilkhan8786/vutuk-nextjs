// models/Payment.ts
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    amount: Number,
    currency: String,
    status: String,
    method: String,
    email: String,
    contact: String,
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;
