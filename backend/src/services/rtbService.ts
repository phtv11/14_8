import { ethers } from "ethers";
import { wallet } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";

const rtbContract = new ethers.Contract(
    process.env.RTB_ADDRESS!,
    RTB.abi,
    wallet
);

// Mint RTB
export async function mintRTB(to: string, matchId: string) {
    const tx = await rtbContract.mintRTB(to, matchId);
    await tx.wait();
    return tx.hash;
}

// Chuyển RTB
export async function transferRTB(to: string, tokenId: number) {
    const tx = await rtbContract.transferRTB(to, tokenId);
    await tx.wait();
    return tx.hash;
}

// Redeem RTB -> RTT
export async function redeemRTB(tokenId: number) {
    const tx = await rtbContract.redeem(tokenId);
    await tx.wait();
    return tx.hash;
}