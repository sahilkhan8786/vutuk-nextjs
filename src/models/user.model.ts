import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  emailVerified: { type: Boolean, default: false },
  image: {
    type: String,
    default:null
  },
  provider: { 
    type: String,
    enum: ['google', 'credentials'],
    default: 'credentials' 
  },
  phone: Number,
  phoneVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  addressCount:{type:Number,default:0}
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
