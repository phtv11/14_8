// ** Nhận dữ liệu từ Frontend, Gọi hàm trong rttService.ts, Trả kết quả về Frontend **//

import { Request, Response } from "express";
import * as rttService from "../services/rttService";

export async function issueTicket(req: Request, res: Response) {
    try {
        const { tokenId, ticketRef } = req.body;

        const txHash = await rttService.issueTicket(
            tokenId,
            ticketRef
        );

        res.status(200).json({
            success: true,
            txHash
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getStatus(req: Request, res: Response) {
    try {
        const tokenId = Number(req.params.tokenId);

        const status = await rttService.getStatus(tokenId);

        res.status(200).json({
            success: true,
            status
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}