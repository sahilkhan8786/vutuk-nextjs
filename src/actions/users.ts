'use server';

import { auth } from "@/auth";
import { updateUserById } from "@/data/user.data";
import { UserUpdateformSchema } from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateUser(id: string, values: z.infer<typeof UserUpdateformSchema>) {
     const session = await auth()
      if (!session || !session.user) {
        return { success: false, error: 'unauthenticated' }
    }
    const isAdmin = session.user.role ==='admin'

      if (!session || !isAdmin) {
        return { success: false, error: 'Unauthorized' }
    }
    
    const validatedFields = UserUpdateformSchema.parse(values);

    if (!validatedFields) {
        return {
            success: false,
            error:"Invalid Fields"
        }
    }
    console.log(validatedFields)

    await updateUserById(id, validatedFields)
    
    revalidatePath('/admin/users')
    
    console.log(values)
}