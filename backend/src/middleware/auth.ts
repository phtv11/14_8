import { Request, Response, NextFunction } from "express";

/**
 * Middleware to protect POST endpoints using an API key from environment.
 * Expects header: x-api-key
 * On missing/invalid key responds 401 with JSON { success: false, message: "Unauthorized" }
 */
export default function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const expected = process.env.API_KEY;

        // If no API key configured, deny access to be safe
        if (!expected) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const provided = req.header("x-api-key");

        if (!provided || provided !== expected) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        return next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}
