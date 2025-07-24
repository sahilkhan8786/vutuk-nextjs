import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import React, { ReactNode } from 'react'
import VerifyMobileForm from '../VerifyMobileForm'

const VerifyMobileFormWrapper = ({ trigger, phoneNumber }: {
    trigger?: ReactNode,
    phoneNumber?: string
}) => {


    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger && trigger}
            </DialogTrigger>

            <VerifyMobileForm phoneNumber={phoneNumber} />

        </Dialog>
    )
}

export default VerifyMobileFormWrapper