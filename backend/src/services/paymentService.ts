import { ethers } from "ethers";
import { provider } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";
import {
    createOrder,
    findOrderById,
    findOrderByIdempotencyKey,
    findOrderByRtbTokenId,
    updateOrderStatus as updateOrderStatusRepo,
    OrderRow
} from "../repositories/orderRepository";



// ================================
// Tạo Order sau thanh toán
// KHÔNG redeem
// ================================

export async function pay(
    userAddress: string,
    rtbTokenId: number,
    matchId: string,
    category: string,
    seat: string,
    price: number,
    idempotencyKey?: string
) {
    if (!userAddress) throw new Error("Thiếu địa chỉ user");
    if (!matchId) throw new Error("Match không hợp lệ");
    if (!category) throw new Error("Category không hợp lệ");
    if (!seat) throw new Error("Seat không hợp lệ");
    if (price <= 0) throw new Error("Giá vé không hợp lệ");

    if (idempotencyKey) {
        const existing = await findOrderByIdempotencyKey(idempotencyKey);
        if (existing) {
            return {
                message: "Order đã tồn tại",
                orderId: existing.id,
                status: existing.status
            };
        }
    }

    const orderId = `ORDER_${Date.now()}`;
    const order: OrderRow = {
        id: orderId,
        userId: userAddress,
        matchId,
        category,
        seat,
        price,
        status: "PENDING",
        rtbTokenId,
        rttTokenId: null,
        txHash: null,
        idempotencyKey: idempotencyKey || null,
        createdAt: new Date()
    };

    await createOrder(order);

    return {
        message: "Tạo order thành công",
        orderId,
        status: "PENDING"
    };
}





// ================================
// Lấy Order
// ================================

export async function getOrder(orderId: string) {
    return await findOrderById(orderId);
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



    const order = await findOrderByRtbTokenId(rtbTokenId);

    if(!order)
        throw new Error(
            "Không tìm thấy order"
        );



    const updated = await updateOrderStatusRepo(
        order.id,
        "REDEEMED",
        rttTokenId
    );



    return updated;

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
    return await updateOrderStatusRepo(
        orderId,
        status,
        rttTokenId
    );
}