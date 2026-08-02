import { Router } from "express";

import {
    issueTicket,
    getStatus,
    ownerOf,
    getTokenInfo,
    exists
} from "../controllers/rttController";

import apiKeyAuth from "../middleware/auth";
import { validateTokenId, validateIssueRTT, validateAddress } from "../middleware/validate";

const router = Router();

router.post("/issue", apiKeyAuth, validateIssueRTT, issueTicket);

router.get("/status/:tokenId", validateTokenId, getStatus);

// Owner by address (indexed)
router.get("/owner/:address", validateAddress, ownerOf);

router.get("/info/:tokenId", validateTokenId, getTokenInfo);

router.get("/exists/:tokenId", validateTokenId, exists);

export default router;