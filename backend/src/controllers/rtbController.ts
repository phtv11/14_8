import { Request, Response, NextFunction } from "express";

import * as rtbService from "../services/rtbService";
import { HttpError } from "../middleware/validate";
import { updateOrderAfterMint } from "../repositories/orderRepository";
import { findTokensByOwner, findToken } from "../repositories/tokenIndexRepository";

const MAX_PACKS_PER_WALLET: Record<string, number> = {
    "WC26-FINAL": 4,
    "MATCH": 2,
    "MATCH-001": 1
};

function getMaxPacksPerWallet(matchId: string): number {
    return MAX_PACKS_PER_WALLET[matchId] ?? 1;
}
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

        const existingTokens = await findTokensByOwner("RTB", to);
        const ownedForMatch = existingTokens.filter((token) => token.matchId === matchId).length;
        const maxAllowed = getMaxPacksPerWallet(matchId);

        if (ownedForMatch >= maxAllowed) {
            throw new HttpError(400, `Ví này đã mua ${ownedForMatch} pack cho trận này. Mỗi ví chỉ được mua tối đa ${maxAllowed} pack.`);
        }

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
        const rawParam = req.params.tokenId;
        const param = Array.isArray(rawParam) ? rawParam[0] : (rawParam || "");

        // If numeric tokenId -> return owner of single token on-chain
        const maybeId = Number(param);
        if (!isNaN(maybeId) && String(maybeId) === param) {
            const owner = await rtbService.ownerOf(maybeId);
            return res.status(200).json({ success: true, owner });
        }

        // Otherwise treat param as owner address and return indexed tokens
        const ownerAddress = param;
        const tokens = await findTokensByOwner("RTB", ownerAddress);
        return res.status(200).json({ success: true, tokens });

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
