import { rateLimit as expressRateLimit } from "express-rate-limit";

/**
 * Standard rate limiter using express-rate-limit
 * @param limit Number of requests allowed within the window
 * @param windowMs Window size in milliseconds
 */
export const rateLimit = (limit: number, windowMs: number) => {
  return expressRateLimit({
    windowMs,
    max: limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests. Please wait a moment before chatting again.",
    },
  });
};
