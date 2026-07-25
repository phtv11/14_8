import express from "express";
import cors from "cors";

import rtbRoutes from "./routes/rtbRoutes";
import rttRoutes from "./routes/rttRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// RTB API
app.use("/api/rtb", rtbRoutes);

// Payment APIs
app.use("/api/payment", paymentRoutes);

// RTT API
app.use("/api/rtt", rttRoutes);

export default app;