'use client';
import { deleteProject } from '@/actions/projects';
import { deleteService } from '@/actions/services';
import { deleteTeamMember } from '@/actions/team';
import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner';

const DeleteHandler = ({ id, docToDelete }: {
    id: string,
    docToDelete?: string
}) => {

    async function deleteDocHander(e: React.FormEvent) {
        e.preventDefault();
        let res;
        try {
            switch (docToDelete) {
                case 'team':
                    res = await deleteTeamMember(id)

                    break;

                case 'service':
                    res = await deleteService(id);
                    break;

                case 'project':
                    res = await deleteProject(id)
                    break;


                default:
                    break;
            }

            if (res?.success) {
                toast.success(res.message);
            } else {
                toast.error(res?.message || 'Something went wrong.');
            }

        } catch (error) {
            toast.error('Failed to delete. Please try again.');
            console.error(error)

        }
    }


    return (
        <form onSubmit={deleteDocHander}>

            <Button
                type='submit'
                size={'lg'} variant={'destructive'}>Delete</Button>
        </form>
    )
}

export default DeleteHandler