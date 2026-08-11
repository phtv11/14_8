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



    const balance =
        await contract.balanceOf(
            address
        );



    const result:any[] = [];



    for(
        let i = 0;
        i < Number(balance);
        i++
    ){

        // MVP giả định tokenId tăng từ 1

        const tokenId =
            i + 1;



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



    const balance =
        await contract.balanceOf(
            address
        );



    const result:any[] = [];



    for(
        let i=0;
        i<Number(balance);
        i++
    ){


        const tokenId =
            i + 1;



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



                result.push({

                    tokenId,

                    matchId:
                    "UNKNOWN",

                    status

                });


            }


        }
        catch{


            continue;


        }


    }



    return result;


}