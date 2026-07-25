// ** Nhận dữ liệu từ Frontend, Gọi hàm trong rtbService.ts, Trả kết quả về Frontend **//

import { Request, Response } from "express";
import * as rtbService from "../services/rtbService";

export async function mintRTB(req: Request, res: Response) {
    try {
        const { to, matchId } = req.body;

        const txHash = await rtbService.mintRTB(to, matchId);

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

export async function transferRTB(req: Request, res: Response) {
    try {
        const { to, tokenId } = req.body;

        const txHash = await rtbService.transferRTB(to, tokenId);

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

export async function redeemRTB(req: Request, res: Response) {
    try {
        const { tokenId } = req.body;

        const txHash = await rtbService.redeemRTB(tokenId);

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