'use client';
import { signInWithGoogle } from "@/actions/auth"



export default function SignInWithGoogle() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await signInWithGoogle();
    }
    return (
        <form
            onSubmit={handleSubmit}
        >
            <button type="submit">Signin with Google</button>
        </form>
    )
} 