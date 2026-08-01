import axios from "axios";


// ============================
// Axios Instance
// ============================

const api = axios.create({

    baseURL:
        import.meta.env.VITE_BACKEND_URL
        ||
        "http://localhost:3000/api",

    headers: {

        "Content-Type":
        "application/json"

    }

});





// ============================
// RTB API
// ============================


// Backend mint RTB
// Backend ký transaction

export async function mintRTB(

    to:string,

    matchId:string

){


    const response =
        await api.post(

            "/rtb/mint",

            {

                to,

                matchId

            }

        );


    return response.data;


}







// ============================
// PAYMENT API
// ============================


// Tạo order sau thanh toán
// Không gọi redeem

export async function createOrder(

    data:{

        userAddress:string;

        rtbTokenId:number;

        matchId:string;

        category:string;

        seat:string;

        price:number;

    }

){


    const response =
        await api.post(

            "/payment/pay",

            data

        );


    return response.data;


}







// Lấy order

export async function getOrder(

    orderId:string

){


    const response =
        await api.get(

            `/payment/order/${orderId}`

        );


    return response.data;


}







// ============================
// RTT API
// ============================


// Backend issue ticket
// Backend ký transaction

export async function issueTicket(

    tokenId:number,

    ticketRef:string

){


    const response =
        await api.post(

            "/rtt/issue",

            {

                tokenId,

                ticketRef

            }

        );


    return response.data;


}







export default api;