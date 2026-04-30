import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter middleware
 * @param limit Number of requests allowed within the window
 * @param windowMs Window size in milliseconds
 */
export const rateLimit = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    store[ip].count++;

    if (store[ip].count > limit) {
      const retryAfter = Math.ceil((store[ip].resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({
        error: "Too many requests. Please wait a moment before chatting again.",
        retryAfter,
      });
    }

    next();
  };
};
