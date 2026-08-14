import { ethers } from "ethers";

import FIFARTB from "../abi/FIFARTB.json";
import FIFARTT from "../abi/FIFARTT.json";



// ==============================
// Contract Address
// ==============================

const RTB_ADDRESS =
    import.meta.env.VITE_RTB_ADDRESS;


const RTT_ADDRESS =
    import.meta.env.VITE_RTT_ADDRESS;



// ==============================
// Provider
// Chỉ đọc blockchain
// ==============================

export function getProvider(){


    if(!window.ethereum){

        throw new Error(
            "MetaMask chưa được cài"
                    );

    }


    return new ethers.BrowserProvider(
        window.ethereum
    );

}



// ==================================================
// Connect Wallet
// Gọi MetaMask lấy địa chỉ user
// ==================================================

export async function connectWallet(forceReconnect = false): Promise<string> {


    if(!window.ethereum){

        throw new Error(
            "Chưa cài MetaMask"
        );

    }

    if (forceReconnect) {
        try {
            await window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [{ eth_accounts: {} }]
            });
        } catch {
            // ignore revoke errors and continue with a fresh request
        }
    }

    const accounts =
        await window.ethereum.request({

            method:"eth_requestAccounts"

        });



    if(accounts.length === 0){

        throw new Error(
            "Không tìm thấy wallet"
        );

    }



    return accounts[0];
}

// ==============================
// Signer
// User ký transaction
// ==============================
async function getSigner(){


    const provider =
        getProvider();



    return await provider.getSigner();


}





// ==============================
// Lấy contract RTB có signer
// Dùng transfer + redeem
// ==============================

async function getRTBContract(){


    const signer =
        await getSigner();



    return new ethers.Contract(

        RTB_ADDRESS,

        FIFARTB.abi,

        signer

    );


}





// ==============================
// Lấy contract RTT đọc dữ liệu
// ==============================

async function getRTTReadContract(){


    const provider =
        getProvider();



    return new ethers.Contract(

        RTT_ADDRESS,

        FIFARTT.abi,

        provider

    );


}







// ==================================================
// USER ACTION
// transferRTB()
// User ký MetaMask
// ==================================================

export async function transferRTB(

    to:string,

    tokenId:number

){


    const contract =
        await getRTBContract();



    const tx =
        await contract.transferRTB(

            to,

            tokenId

        );



    await tx.wait();



    return tx.hash;


}







// ==================================================
// USER ACTION
// redeem RTB -> RTT
// User ký MetaMask
// ==================================================

export async function redeemRTB(

    tokenId:number

){


    const contract =
        await getRTBContract();



    const tx =
        await contract.redeem(

            tokenId

        );



    await tx.wait();



    return tx.hash;


}







// ==================================================
// READ RTB INFO
// ==================================================

export async function getRTBInfo(

    tokenId:number

){


    const provider =
        getProvider();



    const contract =
        new ethers.Contract(

            RTB_ADDRESS,

            FIFARTB.abi,

            provider

        );



    const owner =
        await contract.ownerOf(
            tokenId
        );



    const data =
        await contract.tokenInfo(
            tokenId
        );



    return {

        owner,

        matchId:data.matchId

    };


}







// ==================================================
// READ RTT STATUS
// ==================================================

export async function getRTTStatus(

    tokenId:number

){


    const contract =
        await getRTTReadContract();



    return await contract.getStatus(

        tokenId

    );


}







// ==================================================
// Lấy RTB của user
// DEMO MVP
// ==================================================

export async function getUserRTBs(

    address:string

){


    const provider =
        getProvider();



    const contract =
        new ethers.Contract(

            RTB_ADDRESS,

            FIFARTB.abi,

            provider

        );



    const nextTokenId =
        await contract.nextTokenId();

    const maxTokenId =
        Number(nextTokenId) - 1;

    const result:any[] = [];



    for(
        let tokenId = 1;
        tokenId <= maxTokenId;
        tokenId++
    ){



        try {


            const owner =
                await contract.ownerOf(
                    tokenId
                );



            if(
                owner.toLowerCase()
                ===
                address.toLowerCase()
            ){


                const info =
                    await contract.tokenInfo(
                        tokenId
                    );



                result.push({

                    tokenId,

                    matchId:
                    info.matchId,

                    owner

                });


            }


        }
        catch{

            continue;

        }


    }



    return result;


}







// ==================================================
// Lấy RTT của user
// ==================================================

export async function getUserRTTs(

    address:string

){


    const contract =
        await getRTTReadContract();


    const nextTokenId =
        await contract.nextTokenId();

    const maxTokenId =
        Number(nextTokenId) - 1;


    const result:any[] = [];


    for(
        let tokenId = 1;
        tokenId <= maxTokenId;
        tokenId++
    ){


        try{


            const owner =
                await contract.ownerOf(
                    tokenId
                );


            if(
                owner.toLowerCase()
                ===
                address.toLowerCase()
            ){


                const status =
                    await contract.getStatus(
                        tokenId
                    );

                const info =
                    await contract.tokenInfo(
                        tokenId
                    );


                result.push({

                    tokenId,

                    matchId:
                    info.matchId,

                    status,

                    ticketRef: undefined

                });


            }


        }
        catch{


            continue;


        }


    }



    return result;


}

// ==================================================
// USDC TRANSFER
// User transfers USDC to Payment Wallet
// ==================================================

// ERC20 ABI with approve and allowance
const ERC20_ABI = [
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    },
    {
        constant: true,
        inputs: [
            { name: "_owner", type: "address" },
            { name: "_spender", type: "address" }
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        type: "function"
    },
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
    }
];

export async function transferUSDC(
    amount: number
): Promise<string> {
    const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;
    const PAYMENT_WALLET = import.meta.env.VITE_PAYMENT_WALLET;
    const USDC_DECIMALS = parseInt(import.meta.env.VITE_USDC_DECIMALS || "6");

    if (!USDC_ADDRESS) {
        throw new Error("USDC_ADDRESS not configured in environment");
    }

    if (!PAYMENT_WALLET) {
        throw new Error("PAYMENT_WALLET not configured in environment");
    }

    const signer = await getSigner();
    const userAddress = await signer.getAddress();

    // Create USDC contract instance
    const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        ERC20_ABI,
        signer
    );

    // Convert amount to smallest unit (USDC uses 6 decimals)
    const amountInSmallestUnit = ethers.parseUnits(
        amount.toString(),
        USDC_DECIMALS
    );

    // Step 1: Check current allowance
    const currentAllowance = await usdcContract.allowance(userAddress, PAYMENT_WALLET);
    
    console.log(`[TRANSFER USDC] Current allowance: ${currentAllowance.toString()}`);
    console.log(`[TRANSFER USDC] Required amount: ${amountInSmallestUnit.toString()}`);

    // Step 2: If allowance is insufficient, approve
    if (currentAllowance < amountInSmallestUnit) {
        console.log(`[TRANSFER USDC] Allowance insufficient, requesting approval...`);
        const approveTx = await usdcContract.approve(
            PAYMENT_WALLET,
            amountInSmallestUnit
        );
        console.log(`[TRANSFER USDC] Approval tx: ${approveTx.hash}`);
        await approveTx.wait();
        console.log(`[TRANSFER USDC] Approval confirmed!`);
    } else {
        console.log(`[TRANSFER USDC] Allowance sufficient, skipping approval`);
    }

    // Step 3: Transfer USDC
    console.log(`[TRANSFER USDC] Calling transfer()...`);
    const transferTx = await usdcContract.transfer(
        PAYMENT_WALLET,
        amountInSmallestUnit
    );
    
    console.log(`[TRANSFER USDC] Transfer tx: ${transferTx.hash}`);
    await transferTx.wait();
    console.log(`[TRANSFER USDC] Transfer confirmed!`);

    // Return the TRANSFER tx hash (not approval)
    return transferTx.hash;
}