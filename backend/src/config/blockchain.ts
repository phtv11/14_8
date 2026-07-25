
// **Trung tâm kết nối giữa backend và avalanche**//

import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Kết nối với mạng Avalanche (backend -> provider -> Avalanche Fuji)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Ví Blockchain (Ký transaction, Gửi transaction, Trả gas fee)
const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY!,
    provider
);

export { provider, wallet };