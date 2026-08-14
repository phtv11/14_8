import { provider } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";
import { upsertTokenIndex } from "../repositories/tokenIndexRepository";
import { updateOrderUserByRtbTokenId } from "../repositories/orderRepository";
import { ethers } from "ethers";

let started = false;

export function startIndexer() {
    if (started) return;
    started = true;

    const rtbInterface = new ethers.Interface(RTB.abi);
    const address = process.env.RTB_ADDRESS;

    if (!address) {
        console.error("Indexer: RTB_ADDRESS not configured, indexer not started");
        return;
    }

    console.log("Indexer: starting poller for RTB events, contract=", address);

    (async () => {
        try {
            // Start from a few blocks behind to be safe for near-past events
            const current = await provider.getBlockNumber();
            let lastChecked = Math.max(0, current - 10);

            const POLL_INTERVAL = Number(process.env.INDEXER_POLL_INTERVAL_MS || 5000);

            setInterval(async () => {
                try {
                    const toBlock = await provider.getBlockNumber();
                    if (toBlock <= lastChecked) return;

                    const fromBlock = lastChecked + 1;

                    // Fetch logs for the contract address in the block range
                    const logs = await provider.getLogs({
                        address,
                        fromBlock,
                        toBlock
                    });

                    for (const log of logs) {
                        try {
                            const parsed = rtbInterface.parseLog({ topics: log.topics as string[], data: log.data });

                            if (!parsed || !parsed.name) continue;

                            const txHash = log.transactionHash || null;

                            if (parsed.name === "RTBMinted") {
                                const tokenId = Number(parsed.args.tokenId?.toString());
                                const to = String(parsed.args.to);
                                const matchId = String(parsed.args.matchId);
                                await upsertTokenIndex({
                                    collection: "RTB",
                                    tokenId,
                                    owner: to,
                                    matchId,
                                    mintedAt: new Date(),
                                    txHash
                                });
                            } else if (parsed.name === "RTBTransferred") {
                                // Prioritize custom RTBTransferred event
                                // This is the ONLY event we use for ownership transfer tracking
                                const tokenId = Number(parsed.args.tokenId?.toString());
                                const to = String(parsed.args.to ?? parsed.args[2]);
                                
                                // Update token_index
                                await upsertTokenIndex({
                                    collection: "RTB",
                                    tokenId,
                                    owner: to,
                                    txHash
                                });
                                
                                // Update orders.userId to reflect current holder
                                // This ensures order follows the RTB ownership through transfers
                                await updateOrderUserByRtbTokenId(tokenId, to);
                            } else if (parsed.name === "Transfer") {
                                // Standard ERC721 Transfer event
                                // SKIP if this is a burn event (to = zero address)
                                const tokenId = Number(parsed.args.tokenId?.toString());
                                const to = String(parsed.args.to ?? parsed.args[2]);
                                const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
                                
                                // Skip burn events - don't update orders.userId to zero address
                                if (to.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
                                    // This is a burn event during redeem, ignore
                                    // RedeemedToRTT event will handle the actual holder
                                    continue;
                                }
                                
                                // For non-burn Transfer events, update token_index
                                // but NOT orders.userId - only RTBTransferred updates orders
                                await upsertTokenIndex({
                                    collection: "RTB",
                                    tokenId,
                                    owner: to,
                                    txHash
                                });
                            } else if (parsed.name === "RedeemedToRTT") {
                                const rtbTokenId = Number(parsed.args.rtbTokenId?.toString());
                                const holder = String(parsed.args.holder ?? parsed.args[1]);
                                const rttTokenId = Number(parsed.args.rttTokenId?.toString());

                                await upsertTokenIndex({
                                    collection: "RTB",
                                    tokenId: rtbTokenId,
                                    owner: holder,
                                    txHash
                                });

                                await upsertTokenIndex({
                                    collection: "RTT",
                                    tokenId: rttTokenId,
                                    owner: holder,
                                    txHash
                                });
                            }
                        } catch (e) {
                            // parseLog may throw for logs not matching ABI — skip silently
                            continue;
                        }
                    }

                    lastChecked = toBlock;
                } catch (e) {
                    console.error("Indexer poll error:", e);
                }
            }, POLL_INTERVAL);

        } catch (e) {
            console.error("Indexer startup error:", e);
        }
    })();
}
