import { Router } from "express";

import {
    issueTicket,
    getStatus
} from "../controllers/rttController";

const router = Router();

// Phát hành vé chính thức
router.post("/issue", issueTicket);

// Lấy trạng thái RTT
router.get("/status/:tokenId", getStatus);

export default router;