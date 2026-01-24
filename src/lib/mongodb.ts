import { MongoClient, MongoClientOptions } from "mongodb";
import dns from "node:dns";

const uri = process.env.MONGODB_URI?.trim();

try {
  // Prefer IPv4 addresses on platforms where IPv6 routes can cause TLS handshake failures.
  (dns as unknown as { setDefaultResultOrder?: (order: string) => void })?.setDefaultResultOrder?.("ipv4first");
} catch {
  // ignore
}

// Let the connection string / driver handle TLS settings for MongoDB Atlas
const tlsEnabled = process.env.MONGODB_TLS === "true";
const tlsAllowInvalidCertificates = process.env.MONGODB_TLS_ALLOW_INVALID_CERTS === "true";
const tlsAllowInvalidHostnames = process.env.MONGODB_TLS_ALLOW_INVALID_HOSTNAMES === "true";

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 1,
  family: 4,
  ...(tlsEnabled ? { tls: true } : {}),
  ...(tlsAllowInvalidCertificates ? { tlsAllowInvalidCertificates: true } : {}),
  ...(tlsAllowInvalidHostnames ? { tlsAllowInvalidHostnames: true } : {}),
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
} else {
  // Cache the client promise globally so serverless invocations don't repeatedly
  // negotiate new TLS connections.
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo._mongoClientPromise;
}

export default clientPromise;
