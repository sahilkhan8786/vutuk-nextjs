'use server';


import { formSchemaTeamMember } from '@/schemas/teamMember';
import * as z from 'zod';

export const createTeamMember = async (formData:z.infer<typeof formSchemaTeamMember>) => {
    
    const data = formSchemaTeamMember.parse(formData);



    console.log(data);
}