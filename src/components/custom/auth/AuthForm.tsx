'use client'

import React, { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { Button } from '@/components/ui/button'

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <div className="space-y-4">
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="text-center">
                {isLogin ? (
                    <>
                        <p className="text-sm">
                            Don&apos;t have an account?{' '}
                            <Button variant="link" onClick={() => setIsLogin(false)}>
                                Create one
                            </Button>
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Button variant="link" onClick={() => setIsLogin(true)}>
                                Log in
                            </Button>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default AuthForm
