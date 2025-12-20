import upstashRateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await upstashRateLimit.limit(
      "Too many requests form: ",
      req.ip
    );
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    // Graceful degradation: allow traffic if rate limiter backend fails
    console.error("Rate Limiter Error (degraded, allowing request):", error);
    next();
  }
};

export default rateLimiter;
