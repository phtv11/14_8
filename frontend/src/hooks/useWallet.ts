import { useEffect, useState } from "react";
import { connectWallet } from "../services/contract";


// ===============================
// Type cho Window Ethereum
// ===============================

declare global {

    interface Window {

        ethereum?: any;

    }

}


// ===============================
// Hook quản lý Wallet
// ===============================

export function useWallet() {


    const [address, setAddress] =
        useState<string | null>(null);


    const [connected, setConnected] =
        useState(false);


    const [loading, setLoading] =
        useState(false);



    // ===============================
    // Connect Wallet
    // ===============================

    async function connect() {


        try {


            setLoading(true);


            const walletAddress =
                await connectWallet();



            setAddress(walletAddress);


            setConnected(true);



        }
        catch(error) {


            console.error(
                "Connect wallet failed:",
                error
            );


            throw error;

        }
        finally {


            setLoading(false);

        }

    }




    // ===============================
    // Disconnect local state
    // ===============================

    function disconnect(){


        setAddress(null);

        setConnected(false);


    }





    // ===============================
    // Khi đổi account MetaMask
    // ===============================

    useEffect(() => {


        if(!window.ethereum){

            return;

        }



        window.ethereum.on(
            "accountsChanged",
            (accounts:string[])=>{


                if(accounts.length === 0){


                    disconnect();


                }
                else{


                    setAddress(
                        accounts[0]
                    );


                    setConnected(true);


                }


            }
        );



        // Đổi mạng

        window.ethereum.on(
            "chainChanged",
            ()=>{


                window.location.reload();


            }
        );



        return ()=>{


            window.ethereum.removeAllListeners(
                "accountsChanged"
            );


            window.ethereum.removeAllListeners(
                "chainChanged"
            );


        };


    }, []);





    // ===============================
    // Trả dữ liệu cho component
    // ===============================

    return {


        address,


        connected,


        loading,


        connect,


        disconnect


    };


}