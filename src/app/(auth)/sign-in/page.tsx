import { SignInWithCredentials } from '@/components/custom/auth/sign-in-with-credentials'

import SignInWithGoogle from '@/components/custom/auth/sign-in-with-google'
import React from 'react'

const SignInPage = () => {
    return (
        <div className='h-screen mt-48'>
            <SignInWithGoogle />
            <SignInWithCredentials />
        </div>
    )
}

export default SignInPage;