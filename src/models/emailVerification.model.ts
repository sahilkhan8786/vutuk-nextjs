import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,

    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now() + 10 * 60 * 1000)
    }
})

const EmailVerificationToken = mongoose.models.EmailVerificationToken || mongoose.model('EmailVerificationToken', emailVerificationSchema);

export default EmailVerificationToken;