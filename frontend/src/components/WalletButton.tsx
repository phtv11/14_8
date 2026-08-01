import { Wallet } from "lucide-react";
import { useWallet } from "../hooks/useWallet";



export default function WalletButton() {


    const {
        address,
        connected,
        loading,
        connect
    } = useWallet();




    // ===========================
    // Rút gọn địa chỉ ví
    // ===========================

    function shortenAddress(
        address:string
    ){


        return (

            address.slice(0,6)
            +
            "..."
            +
            address.slice(-4)

        );

    }





    // ===========================
    // Chưa kết nối
    // ===========================

    if(!connected){


        return (

            <button

                onClick={connect}

                disabled={loading}

                className="
                    flex
                    items-center
                    gap-2
                    bg-black
                    text-white
                    px-5
                    py-3
                    rounded-full
                    hover:bg-gray-800
                    transition
                "

            >


                <Wallet size={18}/>


                {
                    loading
                    ?
                    "Connecting..."
                    :
                    "Connect Wallet"
                }


            </button>

        );


    }





    // ===========================
    // Đã kết nối
    // ===========================

    return (

        <button

            className="
                flex
                items-center
                gap-2
                bg-green-600
                text-white
                px-5
                py-3
                rounded-full
            "

        >

            <Wallet size={18}/>


            {
                shortenAddress(
                    address!
                )
            }


        </button>

    );

}