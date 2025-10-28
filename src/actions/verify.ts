'use server';

import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import { comparePassword, saltAndHashPassword } from "@/lib/password";
import { resend } from "@/lib/resend";
import { twilioClient } from "@/lib/twilio";
import EmailVerificationToken from "@/models/emailVerification.model";
import { PhoneVerificationToken } from "@/models/phoneVerification.model";
import { User } from "@/models/user.model";
import { revalidatePath } from "next/cache";

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER;

// -------------------- EMAIL VERIFICATION --------------------

export async function verifyEmailTokenSend() {
  const session = await auth();
  if (!session) return;

  const userId = session.user?.id;
  const email = session.user?.email || '';
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await saltAndHashPassword(otp);

  await connectToDB();
  await EmailVerificationToken.deleteMany({ userId });

  await EmailVerificationToken.create({
    userId,
    token: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });

  await resend.emails.send({
    from: 'noreply@website.khansahil.in',
    to: email,
    subject: "Email Verification Token",
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
  });

  return { success: true };
}

export async function verifyEmailToken(otp: string) {
  const session = await auth();
  if (!session) return { success: false, error: 'Not authenticated' };

  const userId = session.user?.id;
  await connectToDB();

  const tokenDoc = await EmailVerificationToken.findOne({ userId });
  if (!tokenDoc) return { success: false, error: 'OTP not found' };

  if (tokenDoc.expiresAt < new Date()) {
    await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });
    return { success: false, error: 'OTP has expired' };
  }

  const isTokenVerified = await comparePassword(otp, tokenDoc.token);
  if (!isTokenVerified) return { success: false, error: 'Invalid OTP' };

  await User.findByIdAndUpdate(userId, { emailVerified: true }, { new: true, runValidators: false });
  await EmailVerificationToken.deleteOne({ _id: tokenDoc._id });

  revalidatePath('/dashboard/profile');
  return { success: true };
}

// -------------------- PHONE VERIFICATION --------------------

type PhoneData = {
  countryCode: string;
  phoneNumber: string;
};

export async function verifyPhoneTokenSend({ countryCode, phoneNumber }: PhoneData) {
  const fullPhone = `${countryCode}${phoneNumber}`;
  console.log(fullPhone)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await saltAndHashPassword(otp);

  await connectToDB();
  await PhoneVerificationToken.deleteMany({ phone: phoneNumber });

  await PhoneVerificationToken.create({
    phone: phoneNumber,
    token: hashedOtp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    const res = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: TWILIO_PHONE,
      to: fullPhone,
    });
    console.log(res)

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Failed to send SMS' };
  }
}

export async function verifyPhoneToken(otp: string, { countryCode, phoneNumber }: PhoneData) {
  const session = await auth();
  if (!session) return { success: false, error: 'Not authenticated' };

  const userId = session.user?.id;

  await connectToDB();
  const tokenDoc = await PhoneVerificationToken.findOne({ phone: phoneNumber });

  if (!tokenDoc) return { success: false, error: 'OTP not found' };

  if (tokenDoc.expiresAt < new Date()) {
    await PhoneVerificationToken.deleteOne({ _id: tokenDoc._id });
    return { success: false, error: 'OTP expired' };
  }

  const isMatch = await comparePassword(otp, tokenDoc.token);
  if (!isMatch) return { success: false, error: 'Invalid OTP' };

  await User.findByIdAndUpdate(
    userId,
    {
      phone: phoneNumber,
      countryCode: countryCode,
      phoneVerified: true,
    },
    { new: true, runValidators: false }
  );

  await PhoneVerificationToken.deleteOne({ _id: tokenDoc._id });

  revalidatePath('/dashboard/profile');
  return { success: true };
}
