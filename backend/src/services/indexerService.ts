import { provider } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";
import { upsertTokenIndex } from "../repositories/tokenIndexRepository";
import { ethers } from "ethers";

let started = false;

export function startIndexer() {
    if (started) return;
    started = true;

    const rtbContract = new ethers.Contract(
        process.env.RTB_ADDRESS!,
        RTB.abi,
        provider as any
    );

    console.log("Indexer: listening to RTB events");

    rtbContract.on("RTBMinted", async (tokenId: ethers.BigNumber, to: string, matchId: string, event: any) => {
        try {
            const id = Number(tokenId.toString());
            await upsertTokenIndex({
                collection: "RTB",
                tokenId: id,
                owner: to,
                matchId,
                mintedAt: new Date(),
                txHash: event?.transactionHash || null
            });
        } catch (e) {
            console.error("Indexer RTBMinted handler error:", e);
        }
    });

    rtbContract.on("RTBTransferred", async (tokenId: ethers.BigNumber, from: string, to: string, event: any) => {
        try {
            const id = Number(tokenId.toString());
            await upsertTokenIndex({
                collection: "RTB",
                tokenId: id,
                owner: to,
                txHash: event?.transactionHash || null
            });
        } catch (e) {
            console.error("Indexer RTBTransferred handler error:", e);
        }
    });

    rtbContract.on("RedeemedToRTT", async (rtbTokenId: ethers.BigNumber, holder: string, rttTokenId: ethers.BigNumber, event: any) => {
        try {
            const rtbId = Number(rtbTokenId.toString());
            const rttId = Number(rttTokenId.toString());

            // Mark RTB owner to holder (should be same) and insert RTT entry
            await upsertTokenIndex({
                collection: "RTB",
                tokenId: rtbId,
                owner: holder,
                txHash: event?.transactionHash || null
            });

            await upsertTokenIndex({
                collection: "RTT",
                tokenId: rttId,
                owner: holder,
                txHash: event?.transactionHash || null
            });
        } catch (e) {
            console.error("Indexer RedeemedToRTT handler error:", e);
        }
    });
}
