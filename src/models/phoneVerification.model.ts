// lib/models/PhoneVerificationToken.ts
import mongoose from 'mongoose';

const PhoneVerificationTokenSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export const PhoneVerificationToken = 
  mongoose.models.PhoneVerificationToken ||
  mongoose.model('PhoneVerificationToken', PhoneVerificationTokenSchema);
