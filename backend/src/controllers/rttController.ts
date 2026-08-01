// ** Nhận dữ liệu từ Frontend, Gọi hàm trong rttService.ts, Trả kết quả về Frontend **//

import { Request, Response, NextFunction } from "express";
import * as rttService from "../services/rttService";

// ==========================
// Issue Official Ticket
// ==========================
export async function issueTicket(
    req: Request,
    res: Response,
    next: NextFunction
) {

    try {

        const {
            tokenId,
            ticketRef
        } = req.body;

        const txHash =
            await rttService.issueTicket(
                tokenId,
                ticketRef
            );

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

        const tokenId =
            Number(req.params.tokenId);

        const owner =
            await rttService.ownerOf(
                tokenId
            );

        res.status(200).json({
            success: true,
            owner
        });

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