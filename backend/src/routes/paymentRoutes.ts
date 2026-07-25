import { Router } from "express";

import {
    pay
} from "../controllers/paymentController";

const router = Router();

// Thanh toán khi sử dụng RTB để mua vé
router.post("/pay", pay);

export default router;