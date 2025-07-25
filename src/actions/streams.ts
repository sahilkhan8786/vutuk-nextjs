'use server';
import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import Stream from "@/models/streams.model";
export interface Stream {
    _id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}



// Create stream
export async function createStream(value: string) {
  try {
    await connectToDB();
    await Stream.create({ value:value.toLowerCase() });
    return { success: true, message: 'Stream created' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Creation failed' };
  }
}



// Delete stream
export async function deleteStream(id: string) {
 const session = await auth();
  
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message:"Only Admin have access to these Functionalities"
    }
  }

  try {
    await connectToDB();
    await Stream.findByIdAndDelete(id);
    return { success: true,message:"Successfully Deleted the Stream" };
  } catch {
    return { success: false, message: 'Deletion failed' };
  }
}
