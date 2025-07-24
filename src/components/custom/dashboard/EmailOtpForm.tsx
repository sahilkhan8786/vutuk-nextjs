'use client';
import { verifyEmailToken, verifyEmailTokenSend } from '@/actions/verify';
import React, { useState } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';

const EmailOtpForm = () => {
    const [otpSend, setOtpSend] = useState(false);
    const [otp, setOtp] = useState('');
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);

    async function handleSendEmailVerificationOTP(e: React.FormEvent) {
        e.preventDefault();
        setLoadingSend(true);
        try {
            const res = await verifyEmailTokenSend();
            if (res?.success) setOtpSend(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSend(false);
        }
    }

    async function handleEmailVerification(e: React.FormEvent) {
        e.preventDefault();
        setLoadingVerify(true);
        try {
            const res = await verifyEmailToken(otp);
            if (res?.success) {

                toast.success("Email Verified Successfully")
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingVerify(false);
        }
    }

    return (
        <>
            {!otpSend ? (
                <form onSubmit={handleSendEmailVerificationOTP}>
                    <Button
                        variant="secondary"
                        type="submit"
                        className="hover:bg-gray-200"
                        disabled={loadingSend}
                    >
                        {loadingSend ? 'Sending...' : 'Request OTP'}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleEmailVerification}>
                    <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loadingVerify}>
                            {loadingVerify ? 'Verifying...' : 'Verify'}
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </>
    );
};

export default EmailOtpForm;
