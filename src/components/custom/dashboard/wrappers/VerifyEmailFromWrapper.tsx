import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import React, { ReactNode } from 'react'
import VerifyEmailForm from '../VerifyEmailForm'

const VerifyEmailFromWrapper = ({ trigger }: {
    trigger?: ReactNode,
}) => {


    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger && trigger}
            </DialogTrigger>

            <VerifyEmailForm />

        </Dialog>
    )
}

export default VerifyEmailFromWrapper