// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Global cache for serverless environment
const globalWithMongoose = global as typeof globalThis & {
    mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
    conn: null,
    promise: null,
};

if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = cached;
}

export async function connectToDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}