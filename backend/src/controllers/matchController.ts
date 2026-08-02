import { Request, Response, NextFunction } from "express";
import { listMatches } from "../repositories/matchRepository";

export async function getMatches(req: Request, res: Response, next: NextFunction) {
    try {
        const matches = await listMatches();
        res.status(200).json({ success: true, matches });
    } catch (error) {
        next(error);
    }
}
