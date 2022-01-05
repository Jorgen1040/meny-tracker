import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
