import { z } from "zod";
export const UserUpdateformSchema = z.object({
    role: z.enum(["admin", "user"]), // adjust roles as needed
    emailVerified: z.boolean(),
    phoneVerified: z.boolean(),
  });