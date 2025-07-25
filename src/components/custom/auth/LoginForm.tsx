'use client';

import { signIn } from 'next-auth/react';
import FormError from '@/components/custom/auth/form-error';
import FormSuccess from '@/components/custom/auth/form-success';
import SignInWithGoogle from '@/components/custom/auth/sign-in-with-google';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

type SignInResponse = {
    error: string | undefined;
    status: number;
    ok: boolean;
    url?: string | null;
};

const LoginForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false
            }).then((res: SignInResponse | undefined) => {
                if (!res) {
                    setError('Unexpected error occurred.');
                } else if (res.error) {
                    setError('Invalid email or password.');
                } else if (res.ok) {
                    setSuccess('Logged in successfully!');
                    router.refresh();

                }
            });
        });
    };

    return (
        <div>
            <h1>Login</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type="email"
                                            placeholder="john.doe@example.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type="password"
                                            placeholder="********"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />

                    <Button disabled={isPending} type="submit" size="lg" className="w-full">
                        Log In
                    </Button>
                </form>
            </Form>

            <SignInWithGoogle />
        </div>
    );
};

export default LoginForm;
