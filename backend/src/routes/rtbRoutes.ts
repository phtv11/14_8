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
    validateTokenId,
    validateAddress
} from "../middleware/validate";

const router = Router(); // Tạo một đối tượng Router để khai báo các API

// Mint RTB
router.post("/mint", apiKeyAuth, validateMintRTB, mintRTB);

// Owner by address (indexed)
router.get("/owner/:address", validateAddress, ownerOf);

// Token info by id
router.get("/info/:tokenId", validateTokenId, getTokenInfo);

// Convenience: GET /api/rtb/:tokenId -> token info
router.get("/:tokenId", validateTokenId, getTokenInfo);

router.get("/exists/:tokenId", validateTokenId, exists);

export default router;