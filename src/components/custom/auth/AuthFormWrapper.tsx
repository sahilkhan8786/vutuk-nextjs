// components/auth/AuthFormWrapper.tsx
'use client'

import React, {
    ReactNode,
    useImperativeHandle,
    useState,
    forwardRef,
} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import AuthForm from './AuthForm'

export interface AuthDialogHandle {
    open: () => void
    close: () => void
}

const AuthFormWrapper = forwardRef<AuthDialogHandle, { trigger?: ReactNode }>(
    ({ trigger }, ref) => {
        const [open, setOpen] = useState(false)

        useImperativeHandle(ref, () => ({
            open: () => setOpen(true),
            close: () => setOpen(false),
        }))

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                {trigger && <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Welcome to Vutuk</DialogTitle>
                        <DialogDescription>
                            Log in or create an account to continue
                        </DialogDescription>
                    </DialogHeader>

                    <AuthForm />
                </DialogContent>
            </Dialog>
        )
    }
)

AuthFormWrapper.displayName = 'AuthFormWrapper'

export default AuthFormWrapper
