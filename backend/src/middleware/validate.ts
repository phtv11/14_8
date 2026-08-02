import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";

export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HttpError";
        Error.captureStackTrace?.(this, this.constructor);
    }
}

function parseMatchIdWhitelist(): Set<string> {
    const raw = process.env.MINT_RTB_WHITELIST;
    if (!raw) {
        return new Set<string>([
            "WC26-FINAL",
            "MATCH-001",
            "FINAL",
            "MATCH"
        ]);
    }

    return new Set(
        raw
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    );
}

const allowedMatchIds = parseMatchIdWhitelist();

export function validateMintRTB(req: Request, res: Response, next: NextFunction) {
    const { to, matchId } = req.body;

    if (typeof to !== "string" || !ethers.isAddress(to)) {
        return next(new HttpError(400, "Invalid address"));
    }

    if (typeof matchId !== "string" || !matchId.trim()) {
        return next(new HttpError(400, "Invalid matchId"));
    }

    if (!allowedMatchIds.has(matchId.trim())) {
        return next(new HttpError(400, "Invalid matchId"));
    }

    return next();
}

export function validateTokenId(req: Request, res: Response, next: NextFunction) {
    const tokenId = Number(req.params.tokenId);

    if (!Number.isFinite(tokenId) || Number.isNaN(tokenId) || tokenId <= 0 || !Number.isInteger(tokenId)) {
        return next(new HttpError(400, "Invalid tokenId"));
    }

    return next();
}

export function validateAddress(req: Request, res: Response, next: NextFunction) {
    const raw = req.params.address || req.params.owner || req.params.tokenId;
    const addr = Array.isArray(raw) ? raw[0] : raw;
    if (typeof addr !== "string" || !ethers.isAddress(addr)) {
        return next(new HttpError(400, "Invalid address"));
    }

    return next();
}

export function validateIssueRTT(req: Request, res: Response, next: NextFunction) {
    const tokenId = Number(req.body?.tokenId);
    const ticketRef = req.body?.ticketRef;

    if (!Number.isFinite(tokenId) || Number.isNaN(tokenId) || tokenId <= 0 || !Number.isInteger(tokenId)) {
        return next(new HttpError(400, "Invalid tokenId"));
    }

    if (ticketRef !== undefined && typeof ticketRef !== "string") {
        return next(new HttpError(400, "Invalid ticketRef"));
    }

    return next();
}
