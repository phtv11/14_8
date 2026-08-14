const { ethers } = require("ethers");

// Avalanche Fuji RPC
const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

const txHash = "0xba60921aaaea7f86635f78d1a8b3a86fc7999a3b7cdc8e2d9c8aaed756d9e192";
const USDC_ADDRESS = "0x5425890298aed601595a70AB815c96711a31Bc65";

// Standard ERC20 Transfer signature
const ERC20_TRANSFER_SIG = "0xddf252ad1be2c89b69c2b068fc378daf4d6d4c8953b95fe52c97e9dda2e1872a";

// This is USDC.e custom signature
const USDCE_TRANSFER_SIG = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

async function debugTx() {
    console.log("Fetching transaction receipt...");
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
        console.log("❌ Transaction not found!");
        return;
    }
    
    console.log("✅ Transaction found!");
    console.log("Status:", receipt.status ? "SUCCESS" : "FAILED");
    console.log("Total logs:", receipt.logs.length);
    console.log("\n=== ANALYZING LOGS ===");
    
    for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        console.log(`\nLog ${i}:`);
        console.log(`  Contract: ${log.address}`);
        console.log(`  Topic[0]: ${log.topics[0]}`);
        
        if (log.address.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
            console.log(`  ✓ This is from USDC contract!`);
            
            if (log.topics[0] === ERC20_TRANSFER_SIG) {
                console.log(`  ✓ Standard ERC20 Transfer event`);
            } else if (log.topics[0] === USDCE_TRANSFER_SIG) {
                console.log(`  ✓ USDC.e custom Transfer event (FIXED!)`);
                const from = "0x" + log.topics[1].slice(-40);
                const to = "0x" + log.topics[2].slice(-40);
                const amount = BigInt(log.data);
                console.log(`  From: ${from}`);
                console.log(`  To: ${to}`);
                console.log(`  Amount: ${amount.toString()} (${(amount / BigInt(10**6)).toString()} USDC)`);
            } else {
                console.log(`  ✗ Unknown event signature`);
            }
        }
    }
    
    console.log("\n=== SOLUTION ===");
    console.log("USDC on Avalanche Fuji uses custom Transfer signature!");
    console.log("Update transferEventSignature in paymentService.ts to:");
    console.log(`  const transferEventSignature = "${USDCE_TRANSFER_SIG}";`);
}

debugTx().catch(console.error);
