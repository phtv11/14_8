import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function pay(req: Request, res: Response) {
    try {
        const {
            rtbTokenId,
            matchId,
            category,
            seat,
            price
        } = req.body;
// Gọi service
        const result = await paymentService.pay(
            rtbTokenId,
            matchId,
            category,
            seat,
            price
        );
// Trả kết quả về Frontend
        res.status(200).json({
            success: true,
            message: "Payment successful",
            txHash: result.txHash
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}