import { MongoClient, MongoClientOptions } from "mongodb";
import dns from "node:dns";

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// Validate connection string format
if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
  throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
}

try {
  // Prefer IPv4 addresses on platforms where IPv6 routes can cause TLS handshake failures.
  (dns as unknown as { setDefaultResultOrder?: (order: string) => void })?.setDefaultResultOrder?.("ipv4first");
} catch {
  // ignore - not all Node.js versions support this
}

/**
 * MongoDB Atlas Connection Configuration
 * 
 * Important notes for production (Vercel):
 * - MongoDB Atlas ALWAYS uses TLS/SSL (via mongodb+srv:// protocol)
 * - DO NOT add tlsAllowInvalidCertificates or tlsAllowInvalidHostnames (security risk + can cause handshake failures)
 * - Let the connection string handle SSL parameters
 * - Timeouts are optimized for serverless cold starts
 */
const options: MongoClientOptions = {
  // Increased timeouts for serverless cold starts
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  
  // Connection pooling for reusable connections
  maxPoolSize: 10,
  minPoolSize: 1,
  
  // Retry writes on transient failures
  retryWrites: true,
  retryReads: true,
  
  // Compression to reduce network overhead
  compressors: ["snappy", "zlib"],
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Cache the client promise globally so serverless invocations don't repeatedly
// negotiate new TLS connections.
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
    // Log connection failures for debugging
    console.error("MongoDB connection failed:", {
      error: err.message,
      name: err.name,
      // Don't log full URI (contains credentials), just validate format
      protocol: uri.split("://")[0],
      hasCredentials: uri.includes("@"),
    });
    throw err;
  });
}

clientPromise = globalWithMongo._mongoClientPromise;

export default clientPromise;
