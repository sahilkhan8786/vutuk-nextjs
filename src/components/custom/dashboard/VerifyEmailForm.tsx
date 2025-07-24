import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import EmailOtpForm from './EmailOtpForm';


const VerifyEmailForm = () => {


    return (



        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Verify Email</DialogTitle>

                <DialogDescription>
                    Verify your Email, to get all the access from the Vutuk
                </DialogDescription>
            </DialogHeader>
            <EmailOtpForm />


        </DialogContent>



    )
}

export default VerifyEmailForm