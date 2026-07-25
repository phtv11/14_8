import { Router } from "express";

import {
    mintRTB,
    transferRTB,
    redeemRTB
} from "../controllers/rtbController";

const router = Router(); // Tạo một đối tượng Router để khai báo các API

// Mint RTB
router.post("/mint", mintRTB);

// Chuyển nhượng RTB
router.post("/transfer", transferRTB);

// Redeem RTB -> RTT
router.post("/redeem", redeemRTB);

export default router;