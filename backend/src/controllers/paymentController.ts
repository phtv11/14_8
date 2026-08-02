import { Request, Response, NextFunction } from "express";

import * as paymentService
from "../services/paymentService";



// =================================
// Tạo Order
// =================================

export async function pay(

    req:Request,

    res:Response,

    next:NextFunction

){

    try{


        const {
            userAddress,
            rtbTokenId,
            matchId,
            category,
            seat,
            price,
            idempotencyKey
        } = req.body;

        const result =
            await paymentService.pay(
                userAddress,
                rtbTokenId,
                matchId,
                category,
                seat,
                price,
                idempotencyKey
            );



        res.status(200).json({

            success:true,

            data:result

        });



    }
    catch(error){


        next(error);


    }

}





// =================================
// Lấy Order
// =================================

export async function getOrder(

    req:Request,

    res:Response,

    next:NextFunction

){

    try{


        const {
            orderId
        } = req.params;



        if(typeof orderId !== "string"){

            return res.status(400).json({

                success:false,

                message:
                "Order ID không hợp lệ"

            });

        }



        const order =
            await paymentService.getOrder(
                orderId
            );



        if(!order){

            return res.status(404).json({

                success:false,

                message:
                "Không tìm thấy order"

            });

        }



        res.json({

            success:true,

            data:order

        });



    }
    catch(error){


        next(error);


    }

}





// =================================
// Nhận txHash redeem từ FE
// =================================

export async function submitRedeemTx(

    req:Request,

    res:Response,

    next:NextFunction

){

    try{


        const {
            txHash
        } = req.body;



        const result =
            await paymentService.processRedeemTx(
                txHash
            );



        res.status(200).json({

            success:true,

            data:result

        });



    }
    catch(error){


        next(error);


    }

}





// =================================
// Update Order
// =================================

export async function updateOrderStatus(

    req:Request,

    res:Response,

    next:NextFunction

){

    try{


        const {

            orderId,

            status,

            rttTokenId


        } = req.body;



        const result =
            await paymentService.updateOrderStatus(

                orderId,

                status,

                rttTokenId

            );



        res.json({

            success:true,

            data:result

        });



    }
    catch(error){


        next(error);


    }

}