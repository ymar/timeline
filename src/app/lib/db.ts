import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'your_database_name' // Hardcoded database name

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null, clientPromise: null }
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
        cached.conn.connection.useDb(DB_NAME)
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export async function getMongoClientPromise() {
    if (cached.clientPromise) {
        const client = await cached.clientPromise
        return client.db(DB_NAME)
    }

    const client = new MongoClient(MONGODB_URI!)
    cached.clientPromise = client.connect()

    const connectedClient = await cached.clientPromise
    return connectedClient.db(DB_NAME)
}

export { dbConnect as connectToDatabase }
