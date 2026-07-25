import { ethers } from "ethers";
import { wallet } from "../config/blockchain";
import RTT from "../contracts/FIFARTT.json";

const rttContract = new ethers.Contract(
    process.env.RTT_ADDRESS!,
    RTT.abi,
    wallet
);

// Phát hành vé chính thức
export async function issueTicket(
    tokenId: number,
    ticketRef: string
) {
    const tx = await rttContract.issueTicket(tokenId, ticketRef);
    await tx.wait();
    return tx.hash;
}

// Lấy trạng thái RTT
export async function getStatus(tokenId: number) {
    return await rttContract.getStatus(tokenId);
}