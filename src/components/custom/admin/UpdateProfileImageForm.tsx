'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetClose, SheetFooter } from '@/components/ui/sheet';
import { updateProfileImage } from '@/actions/users';
import { useSession } from 'next-auth/react';


const UpdateProfileImageForm = ({
    id,
    onClose,
}: {
    id?: string;
    onClose: () => void;
}) => {
    const { update } = useSession();
    const formRef = React.useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        if (!id) return;

        formData.append('userId', id);

        try {
            const res = await updateProfileImage(formData);
            formRef.current?.reset();
            console.log(res)
            await update({ image: res?.imageUrl });
            onClose();
        } catch (err) {
            console.error('Failed to update profile image:', err);
        }
    }

    return (
        <form action={handleSubmit} ref={formRef}>
            <div className="grid gap-4 px-4 py-2">
                <div className="grid gap-2">
                    <Label htmlFor="profile-image">Upload Profile Image</Label>
                    <Input
                        id="profile-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        required
                    />
                </div>
            </div>
            <SheetFooter className="px-4 pb-4 pt-2">
                <Button type="submit">Save changes</Button>
                <SheetClose asChild>
                    <Button variant="outline" type="button">
                        Close
                    </Button>
                </SheetClose>
            </SheetFooter>
        </form>
    );
};

export default UpdateProfileImageForm;
