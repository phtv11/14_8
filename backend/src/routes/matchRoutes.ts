import { Router } from "express";
import { getMatches } from "../controllers/matchController";

const router = Router();

router.get("/", getMatches);

export default router;
