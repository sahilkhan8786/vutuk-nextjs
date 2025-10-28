'use client';
import { signInWithGoogle } from "@/actions/auth"
import { FaGoogle } from "react-icons/fa6";



export default function SignInWithGoogle() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await signInWithGoogle();
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 w-full"
        >
            <button type="submit" className="w-full border py-2 rounded-xl hover:bg-primary cursor-pointer hover:text-secondary">
                <span className="flex items-center justify-center gap-4">
                    <FaGoogle />
                    Sign In with Google
                </span>
            </button>
        </form>
    )
} 