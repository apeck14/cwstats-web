import { MongoClient } from "mongodb"

if (!process.env.URI) throw new Error('Invalid/Missing environment variable: "URI"')

const uri = process.env.URI

let client
// eslint-disable-next-line import/no-mutable-exports
let clientPromise

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()

    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB! (dev)")
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
