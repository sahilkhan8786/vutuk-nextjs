'use client';

import { login } from '@/actions/auth';
import FormError from '@/components/custom/auth/form-error';
import FormSuccess from '@/components/custom/auth/form-success';
import SignInWithGoogle from '@/components/custom/auth/sign-in-with-google';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSumbit = (values: z.infer<typeof loginSchema>) => {
        setError('');
        setSuccess('');

        console.log(values)
        startTransition(() => {
            login(values)
                .then((data) => {
                    setSuccess(data?.success || '');
                    setError(data?.error || '');
                })
        })

    }



    return (
        <div className=''>
            <h1>Login</h1>


            <Form {...form}>
                <form onSubmit={(form.handleSubmit(onSumbit))}
                    className='space-y-6'
                >
                    <div className='space-y-4'>

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type='email'
                                            placeholder='john.doe@example.com'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type='password'
                                            placeholder='********'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type='submit'
                        size={'lg'}
                        className='w-full'
                    >Log In</Button>


                </form>
            </Form>

            <SignInWithGoogle />
        </div>
    )
}

export default LoginForm