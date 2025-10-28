"use client";

import { deleteProject } from '@/actions/projects';
import { deleteService } from '@/actions/services';
import { deleteTeamMember } from '@/actions/team';
import { deleteCoupon } from '@/actions/coupons'; // ✅ import
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import React from 'react';
import { useRouter } from 'next/navigation';

const DeleteHandler = ({ id, docToDelete }: { id: string; docToDelete?: string }) => {
    const router = useRouter();

    async function deleteDocHandler(e: React.FormEvent) {
        e.preventDefault();
        let res;
        try {
            switch (docToDelete) {
                case 'team':
                    res = await deleteTeamMember(id);
                    break;
                case 'service':
                    res = await deleteService(id);
                    break;
                case 'project':
                    res = await deleteProject(id);
                    break;
                case 'coupon': // ✅ new case
                    res = await deleteCoupon(id);
                    break;
                default:
                    break;
            }

            if (res?.success) {
                toast.success(res.message);
                router.refresh(); // ✅ refresh SSR list
            } else {
                toast.error(res?.message || 'Something went wrong.');
            }
        } catch (error) {
            toast.error('Failed to delete. Please try again.');
            console.error(error);
        }
    }

    return (
        <form onSubmit={deleteDocHandler}>
            <Button type="submit" size="sm" variant="destructive">
                Delete
            </Button>
        </form>
    );
};

export default DeleteHandler;
