import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Validation middleware for Express routes
 * @param schema Zod schema to validate against
 * @param source Source of data to validate (body, query, params)
 */
export const validate = (schema: ZodSchema, source: "body" | "query" | "params" = "body") => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: error.issues.map(e => ({ path: e.path, message: e.message })),
          },
        });
      }
      next(error);
    }
  };
