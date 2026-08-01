import { Router } from "express";

import {
    mintRTB,
    ownerOf,
    getTokenInfo,
    exists
} from "../controllers/rtbController";

import apiKeyAuth from "../middleware/auth";

const router = Router(); // Tạo một đối tượng Router để khai báo các API

// Mint RTB
router.post("/mint", apiKeyAuth, mintRTB);

router.get("/owner/:tokenId", ownerOf);

router.get("/info/:tokenId", getTokenInfo);

router.get("/exists/:tokenId", exists);

export default router;