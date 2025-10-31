'use server';

import { signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/data/user.data";
import { AdminNewUserEmail } from "@/emails/AdminNewUserEmail";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { connectToDB } from "@/lib/mongodb";
import { resend } from "@/lib/resend";
import { User } from "@/models/user.model";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema, registerSchema } from "@/schemas/authSchema";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }

  const { email, password } = validatedFields.data;

  await connectToDB();

  const res = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (!res) {
    return {
      error: 'Unexpected error. Please try again.',
    };
  }

  if (res.error) {
    return {
      error: 'Invalid credentials',
    };
  }

  return {
    success: 'Logged in successfully!',
  };
};

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);
  await connectToDB();

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields"
    }
  }


  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10); // Here you would hash the password

  const existingUser = await getUserByEmail(email);
  if (existingUser && existingUser.provider === 'google') {
    return {
      error: 'This email is already registered via Google. Please sign in with Google.',
    };
  }


  if (existingUser) {
    return {
      error: "Email already exists"
    }
  }


  await User.create({
    name,
    email,
    password: hashedPassword,
    provider: 'credentials'
  });

  try {
    await resend.emails.send({
      from: 'Vutuk <onboarding@vutuk.com>',
      to: email,
      subject: 'Welcome to Vutuk!',
      react: WelcomeEmail({ name }),
    });
    await resend.emails.send({
      from: 'Vutuk <onboarding@vutuk.com>',
      to: email,
      subject: 'New User On Vutuk',
      react: AdminNewUserEmail({ name, email }),
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }




  return {
    success: true,
    message: ' "User created successfully!"'
  }

}


export async function logout() {
  await signOut({
    redirectTo: '/'
  })
}

export async function signInWithGoogle() {
  await signIn('google', {
    redirect: true,
    callbackUrl: DEFAULT_LOGIN_REDIRECT
  })
}