import { Router } from "express";


import {
    pay,
    getOrder,
    submitRedeemTx,
    updateOrderStatus
} from "../controllers/paymentController";

const router = Router();

// Tạo order
router.post("/pay", pay);

// Lấy order
router.get("/order/:orderId", getOrder);

// FE gửi txHash sau redeem
router.post("/redeem", submitRedeemTx);

// cập nhật trạng thái
router.put("/order/status", updateOrderStatus);

export default router;