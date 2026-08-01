import { ethers } from "ethers";
import { provider } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";


// ================================
// Demo database
// Sau này thay bằng SQL/MongoDB
// ================================

interface Order {

    orderId: string;

    userAddress: string;

    rtbTokenId: number;

    matchId: string;

    category: string;

    seat: string;

    price: number;

    status: string;

    rttTokenId?: number;

}


const orders: Order[] = [];



// ================================
// Tạo Order sau thanh toán
// KHÔNG redeem
// ================================

export async function pay(

    userAddress:string,

    rtbTokenId:number,

    matchId:string,

    category:string,

    seat:string,

    price:number

){

    if(!userAddress)
        throw new Error(
            "Thiếu địa chỉ user"
        );


    if(!matchId)
        throw new Error(
            "Match không hợp lệ"
        );


    if(!category)
        throw new Error(
            "Category không hợp lệ"
        );


    if(!seat)
        throw new Error(
            "Seat không hợp lệ"
        );


    if(price <= 0)
        throw new Error(
            "Giá vé không hợp lệ"
        );



    // giả lập thanh toán thành công

    const paymentStatus = true;


    if(!paymentStatus)
        throw new Error(
            "Thanh toán thất bại"
        );



    const orderId =
        `ORDER_${Date.now()}`;



    const order:Order = {

        orderId,

        userAddress,

        rtbTokenId,

        matchId,

        category,

        seat,

        price,

        status:"PENDING"

    };



    orders.push(order);



    return {

        message:
        "Tạo order thành công",

        orderId,

        status:
        "PENDING"

    };

}





// ================================
// Lấy Order
// ================================

export async function getOrder(
    orderId:string
){

    return orders.find(
        order =>
        order.orderId === orderId
    );

}





// ================================
// Nhận txHash sau khi user redeem
//
// Frontend:
// MetaMask redeem()
//        |
//        v
// txHash gửi backend
//
// Backend:
// đọc event RedeemedToRTT
// update order
// ================================


export async function processRedeemTx(
    txHash:string
){


    if(!txHash)
        throw new Error(
            "Thiếu transaction hash"
        );



    const receipt =
        await provider.getTransactionReceipt(
            txHash
        );



    if(!receipt)
        throw new Error(
            "Transaction chưa được xác nhận"
        );



    const rtbInterface =
        new ethers.Interface(
            RTB.abi
        );



    let rttTokenId:number | undefined;

    let rtbTokenId:number | undefined;



    for(
        const log of receipt.logs
    ){

        try {


            const parsed =
                rtbInterface.parseLog({
                    topics:
                    log.topics as string[],

                    data:
                    log.data
                });



            if(
                parsed &&
                parsed.name ===
                "RedeemedToRTT"
            ){


                rtbTokenId =
                    Number(
                        parsed.args.rtbTokenId
                    );


                rttTokenId =
                    Number(
                        parsed.args.rttTokenId
                    );


            }


        }
        catch{

            continue;

        }

    }



    if(
        !rtbTokenId ||
        !rttTokenId
    ){

        throw new Error(
            "Không tìm thấy event RedeemedToRTT"
        );

    }



    const order =
        orders.find(
            item =>
            item.rtbTokenId === rtbTokenId
        );



    if(!order)
        throw new Error(
            "Không tìm thấy order"
        );



    order.status =
        "REDEEMED";


    order.rttTokenId =
        rttTokenId;



    return order;

}





// ================================
// Update Order thủ công
// dùng cho backend listener sau này
// ================================

export async function updateOrderStatus(

    orderId:string,

    status:string,

    rttTokenId?:number

){

    const order =
        orders.find(
            item =>
            item.orderId === orderId
        );



    if(!order)
        throw new Error(
            "Không tìm thấy order"
        );



    order.status =
        status;



    if(rttTokenId){

        order.rttTokenId =
            rttTokenId;

    }



    return order;

}