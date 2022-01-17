import { MongoClient, ServerApiVersion } from 'mongodb'

// type GlobalMongoClientPromise = typeof globalThis & { ["_mongoClientPromise"]: Promise<MongoClient>};

const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set')
}

if (process.env.NODE_ENV === "development") {
    // If in develompent environment, add database connection to globals to be accessible after hot reloads
    let mongoGlobal = global as typeof globalThis & { 
        _mongoClientPromise: Promise<MongoClient>
    };
    if (!mongoGlobal._mongoClientPromise) {
        client = new MongoClient(uri!, options);
        mongoGlobal._mongoClientPromise = client.connect();
    }
    clientPromise = mongoGlobal._mongoClientPromise;
} else {
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
}

export default clientPromise;