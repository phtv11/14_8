import * as rtbService from "./rtbService";

export async function pay(
    rtbTokenId: number,
    matchId: string,
    category: string,
    seat: string,
    price: number
) {

    // Bước 1: Kiểm tra dữ liệu
    if (!matchId) {
        throw new Error("Match không hợp lệ");
    }

    if (!category) {
        throw new Error("Category không hợp lệ");
    }

    if (!seat) {
        throw new Error("Seat không hợp lệ");
    }

    if (price <= 0) {
        throw new Error("Giá vé không hợp lệ");
    }

    // Bước 2: Giả lập thanh toán thành công
    const paymentStatus = true;

    if (!paymentStatus) {
        throw new Error("Thanh toán thất bại");
    }

    // Bước 3: Sau khi thanh toán thành công
    // Burn RTB -> Mint RTT
    const txHash = await rtbService.redeemRTB(rtbTokenId);

    // Bước 4: Trả kết quả
    return {
        txHash
    };
}