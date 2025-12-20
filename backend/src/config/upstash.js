import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import dotenv from "dotenv";
dotenv.config();

// In-memory fallback rate limiter
class InMemoryRateLimiter {
  constructor(maxRequests, timeWindowSeconds) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowSeconds * 1000; // Convert to milliseconds
    this.requests = new Map(); // Store { key: [timestamps] }
  }

  async limit(identifier, key) {
    const now = Date.now();
    const fullKey = `${identifier}${key}`;

    if (!this.requests.has(fullKey)) {
      this.requests.set(fullKey, []);
    }

    const timestamps = this.requests.get(fullKey);

    // Remove timestamps outside the time window
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    if (validTimestamps.length < this.maxRequests) {
      validTimestamps.push(now);
      this.requests.set(fullKey, validTimestamps);
      return { success: true };
    }

    return { success: false };
  }
}

let time = 60,
  maxRequests = 100;

let ratelimit;
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.fixedWindow(maxRequests, `${time} s`),
    });
    console.log(" Upstash rate limiter initialized");
  } catch (e) {
    console.warn(
      " Upstash initialization failed, using in-memory limiter:",
      e.message
    );
  }
}

// Fallback: in-memory limiter when Upstash isn't configured or fails
if (!ratelimit) {
  ratelimit = new InMemoryRateLimiter(maxRequests, time);
  console.log("In-memory rate limiter active (", maxRequests, ` req/${time}s)`);
}

export default ratelimit;
