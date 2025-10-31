'use client'

import React, {
    ReactNode,
    useImperativeHandle,
    useState,
    useEffect,
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
import { useSearchParams } from 'next/navigation'

export interface AuthDialogHandle {
    open: () => void
    close: () => void
}

interface AuthFormWrapperProps {
    trigger?: ReactNode
}

const AuthFormWrapper = forwardRef<AuthDialogHandle, AuthFormWrapperProps>(
    ({ trigger }, ref) => {
        const [open, setOpen] = useState(false)
        const searchParams = useSearchParams()

        // ✅ Auto-open when redirected with ?showAuth=true
        useEffect(() => {
            const shouldShowAuth = searchParams.get('showAuth')
            if (shouldShowAuth === 'true') {
                setOpen(true)

                // Optional: Clean the URL after opening
                const url = new URL(window.location.href)
                url.searchParams.delete('showAuth')
                window.history.replaceState({}, '', url.toString())
            }
        }, [searchParams])

        // ✅ Expose open/close methods for manual control (like from Header)
        useImperativeHandle(ref, () => ({
            open: () => setOpen(true),
            close: () => setOpen(false),
        }))

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

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
