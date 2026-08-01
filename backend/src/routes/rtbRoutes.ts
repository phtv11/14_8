import { Router } from "express";

import {
    mintRTB,
    ownerOf,
    getTokenInfo,
    exists
} from "../controllers/rtbController";

import apiKeyAuth from "../middleware/auth";
import {
    validateMintRTB,
    validateTokenId
} from "../middleware/validate";

const router = Router(); // Tạo một đối tượng Router để khai báo các API

// Mint RTB
router.post("/mint", apiKeyAuth, validateMintRTB, mintRTB);

router.get("/owner/:tokenId", validateTokenId, ownerOf);

router.get("/info/:tokenId", validateTokenId, getTokenInfo);

router.get("/exists/:tokenId", validateTokenId, exists);

export default router;