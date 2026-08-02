// ** Nhận dữ liệu từ Frontend, Gọi hàm trong rttService.ts, Trả kết quả về Frontend **//

import { Request, Response, NextFunction } from "express";
import { HttpError } from "../middleware/validate";
import * as rttService from "../services/rttService";
import {
    findOrderByRttTokenId,
    updateOrderAfterIssue
} from "../repositories/orderRepository";
import { findMatchById } from "../repositories/matchRepository";
import { findTokensByOwner } from "../repositories/tokenIndexRepository";

// ==========================
// Issue Official Ticket
// ==========================
export async function issueTicket(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const tokenId = Number(req.body?.tokenId);
        let ticketRef = typeof req.body?.ticketRef === "string" ? req.body.ticketRef.trim() : "";
        let order = null;

        if (!ticketRef) {
            order = await findOrderByRttTokenId(tokenId);

            if (!order) {
                throw new HttpError(404, "Không tìm thấy order tương ứng với tokenId");
            }

            const match = await findMatchById(order.matchId);
            ticketRef = `user:${order.userId};match:${match?.name ?? order.matchId};seat:${order.seat}`;
        }

        const txHash = await rttService.issueTicket(
            tokenId,
            ticketRef
        );

        if (!order) {
            order = await findOrderByRttTokenId(tokenId);
        }

        if (order) {
            await updateOrderAfterIssue(order.id, tokenId);
        }

        res.status(200).json({
            success: true,
            txHash
        });

    }
    catch (error) {

        next(error);

    }

}

// ==========================
// Lấy trạng thái RTT
// ==========================
export async function getStatus(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const tokenId =
            Number(req.params.tokenId);

        const status =
            await rttService.getStatus(
                tokenId
            );

        res.status(200).json({
            success: true,
            status
        });

    }
    catch (error) {

        next(error);

    }

}

// ==========================
// Lấy chủ sở hữu RTT
// ==========================
export async function ownerOf(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {
        const param = req.params.tokenId;
        const maybeId = Number(param);

        if (!isNaN(maybeId) && String(maybeId) === param) {
            const owner = await rttService.ownerOf(maybeId);
            return res.status(200).json({ success: true, owner });
        }

        const ownerAddress = param;
        const tokens = await findTokensByOwner("RTT", ownerAddress);
        return res.status(200).json({ success: true, tokens });

    }
    catch (error) {

        next(error);

    }

}

// ==========================
// Lấy thông tin RTT
// ==========================
export async function getTokenInfo(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const tokenId =
            Number(req.params.tokenId);

        const info =
            await rttService.getTokenInfo(
                tokenId
            );

        res.status(200).json({
            success: true,
            data: info
        });

    }
    catch (error) {

        next(error);

    }

}

// ==========================
// Kiểm tra RTT tồn tại
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
            await rttService.exists(
                tokenId
            );

        res.status(200).json({
            success: true,
            exists
        });

    }
    catch (error) {

        next(error);

    }

}