import mongoose from "mongoose";
import { Resolver } from "dns/promises";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Resolve mongodb+srv:// URI to a standard mongodb:// URI using Google DNS.
 * Needed on Windows where the local resolver refuses SRV record lookups.
 */
async function resolveMongoURI(uri: string): Promise<string> {
  // Only process SRV URIs
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const url = new URL(uri);
  const srvHost = url.hostname; // e.g. cluster0.bwkjefr.mongodb.net

  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);

  // Resolve SRV records
  const srvRecords = await resolver.resolveSrv(`_mongodb._tcp.${srvHost}`);
  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

  // Resolve TXT records (contain extra connection options like replicaSet, authSource)
  let txtOptions = "tls=true&authSource=admin";
  try {
    const txtRecords = await resolver.resolveTxt(srvHost);
    const flat = txtRecords.flat().join("&");
    if (flat) txtOptions = flat + "&tls=true";
  } catch {
    // TXT records optional
  }

  const db = url.pathname || "/wedding";
  const standardURI = `mongodb://${url.username}:${url.password}@${hosts}${db}?${txtOptions}&retryWrites=true&w=majority`;
  console.log("[db] Resolved to standard URI (hosts redacted):", standardURI.replace(/:([^@]+)@/, ":***@"));
  return standardURI;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = resolveMongoURI(MONGODB_URI)
      .then((uri) => mongoose.connect(uri))
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request can retry
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
