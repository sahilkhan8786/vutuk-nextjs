import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import PhoneOtpForm from './PhoneOtpForm';


const VerifyMobileForm = ({ phoneNumber }: {
    phoneNumber?: string
}) => {


    return (



        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Verify Phone Number</DialogTitle>

                <DialogDescription>
                    Verify your Email, to get all the access from the Vutuk
                </DialogDescription>
            </DialogHeader>
            <PhoneOtpForm phoneNumber={phoneNumber} />


        </DialogContent>



    )
}

export default VerifyMobileForm