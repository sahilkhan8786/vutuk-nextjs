import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error("Please define the MONGO_DB environment variable inside the .env file");
}

// Define the type for our cached connection
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Initialize cached variable with proper typing
const cached: MongooseCache = (global as typeof globalThis & { mongoose?: MongooseCache }).mongoose || { 
    conn: null, 
    promise: null 
};

export async function connectToDB(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        // Reset cached promise if connection fails
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}