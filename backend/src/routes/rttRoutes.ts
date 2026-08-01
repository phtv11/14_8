import { Router } from "express";

import {
    issueTicket,
    getStatus,
    ownerOf,
    getTokenInfo,
    exists
} from "../controllers/rttController";

import apiKeyAuth from "../middleware/auth";

const router = Router();

router.post("/issue", apiKeyAuth, issueTicket);

router.get("/status/:tokenId", getStatus);

router.get("/owner/:tokenId", ownerOf);

router.get("/info/:tokenId", getTokenInfo);

router.get("/exists/:tokenId", exists);

export default router;