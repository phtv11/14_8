import { Request, Response, NextFunction } from "express";

import * as rtbService from "../services/rtbService";
import { updateOrderAfterMint } from "../repositories/orderRepository";
// ==========================
// Mint RTB
// ==========================
export async function mintRTB(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { to, matchId, orderId } = req.body;

        const result = await rtbService.mintRTB(to, matchId);

        // If frontend provided an orderId, update order to record rtbTokenId and txHash
        if (orderId && typeof orderId === "string") {
            try {
                await updateOrderAfterMint(orderId, result.tokenId, result.txHash);
            } catch (e) {
                // Log and continue; do not fail the mint response for order update failure
                console.error("Failed to update order after mint:", e);
            }
        }

        res.status(200).json({
            success: true,
            txHash: result.txHash,
            tokenId: result.tokenId
        });
    } catch (error) {
        next(error);
    }
}

// ==========================
// Owner Of
// ==========================
export async function ownerOf(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const tokenId = Number(req.params.tokenId);

        const owner = await rtbService.ownerOf(tokenId);

        res.status(200).json({
            success: true,
            owner
        });
    } catch (error) {
        next(error);
    }
}

// ==========================
// Token Info
// ==========================
export async function getTokenInfo(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const tokenId = Number(req.params.tokenId);

        const info = await rtbService.getTokenInfo(tokenId);

        res.status(200).json({
            success: true,
            data: info
        });
    } catch (error) {
        next(error);
    }
}

// ==========================
// Exists
// ==========================
export async function exists(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const tokenId =
            Number(req.params.tokenId);

        const exists =
            await rtbService.exists(
                tokenId
            );

        res.status(200).json({
            success: true,
            exists
        });

    } catch (error) {
        next(error);
    }
}
