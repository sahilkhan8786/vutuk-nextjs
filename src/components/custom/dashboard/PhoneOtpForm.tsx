'use client';

import { verifyPhoneToken, verifyPhoneTokenSend } from '@/actions/verify';
import React, { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Country = {
    name: string;
    code: string;
    callingCode: string;
};

type CountryAPIResponse = {
    name: {
        common: string;
    };
    cca2: string;
    idd: {
        root?: string;
        suffixes?: string[];
    };
};

const PhoneOtpForm = ({ phoneNumber }: { phoneNumber?: string }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [countryCode, setCountryCode] = useState('+91'); // default or dynamic
    const [number, setNumber] = useState(phoneNumber ?? '');
    const [otpSend, setOtpSend] = useState(false);
    const [otp, setOtp] = useState('');
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
            .then((res) => res.json())
            .then((data: CountryAPIResponse[]) => {
                const list = data
                    .map((c) => ({
                        name: c.name.common,
                        code: c.cca2,
                        callingCode: c.idd?.root + (c.idd?.suffixes?.[0] ?? ''),
                    }))
                    .filter((c) => c.callingCode && c.callingCode.trim() !== '')
                    .reduce((acc: Record<string, Country>, curr) => {
                        acc[curr.callingCode] = acc[curr.callingCode] || curr;
                        return acc;
                    }, {});
                setCountries(Object.values(list).sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch(console.error);
    }, []);


    async function handleSendPhoneVerificationOTP(e: React.FormEvent) {
        e.preventDefault();
        setLoadingSend(true);
        try {
            const res = await verifyPhoneTokenSend({
                countryCode: countryCode,
                phoneNumber: number
            });
            if (res?.success) {
                setOtpSend(true);
                toast.success('OTP sent to your phone');
            } else {
                toast.error(res?.error || 'Failed to send OTP');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while sending OTP');
        } finally {
            setLoadingSend(false);
        }
    }

    async function handlePhoneVerification(e: React.FormEvent) {
        e.preventDefault();
        setLoadingVerify(true);
        try {
            const res = await verifyPhoneToken(otp,
                {
                    countryCode: countryCode,
                    phoneNumber: number
                }
            );
            if (res?.success) {
                toast.success('Phone number verified successfully');
            } else {
                toast.error(res?.error || 'Invalid OTP');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during verification');
        } finally {
            setLoadingVerify(false);
        }
    }

    return (
        <>
            {!otpSend ? (
                <form onSubmit={handleSendPhoneVerificationOTP} className="space-y-4">
                    <div className="flex gap-2">
                        <Select onValueChange={(val) => setCountryCode(val)} defaultValue={countryCode}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((c) => (
                                    <SelectItem key={c.callingCode} value={c.callingCode}>
                                        {c.name} ({c.callingCode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            name="number"
                            id="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Enter phone number"
                            type="tel"
                        />
                    </div>

                    <Button type="submit" disabled={loadingSend} className="w-full">
                        {loadingSend ? 'Sending...' : 'Request OTP'}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handlePhoneVerification}>
                    <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={setOtp}
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

export default PhoneOtpForm;
