/* eslint-disable import/no-mutable-exports */
import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.URI) throw new Error("Invalid URI")

const uri = process.env.URI

const options = {
  serverApi: {
    deprecationErrors: true,
    // strict: true,
    version: ServerApiVersion.v1,
  },
}

let client

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options)
  }
  client = global._mongoClient
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
}

export default client
