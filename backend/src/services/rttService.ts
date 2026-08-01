import { ethers } from "ethers";
import { wallet } from "../config/blockchain";
import RTT from "../contracts/FIFARTT.json";

const rttContract = new ethers.Contract(
    process.env.RTT_ADDRESS!,
    RTT.abi,
    wallet
);

// ==========================
// Issue Official Ticket
// (Backend ký)
// ==========================
export async function issueTicket(
    tokenId: number,
    ticketRef: string
): Promise<string> {

    const tx = await rttContract.issueTicket(
        tokenId,
        ticketRef
    );

    await tx.wait();

    return tx.hash;

}

// ==========================
// Lấy trạng thái RTT
// ==========================
export async function getStatus(
    tokenId: number
): Promise<string> {

    return await rttContract.getStatus(
        tokenId
    );

}

// ==========================
// Lấy chủ sở hữu RTT
// ==========================
export async function ownerOf(
    tokenId: number
): Promise<string> {

    return await rttContract.ownerOf(
        tokenId
    );

}

// ==========================
// Lấy thông tin RTT
// ==========================
export async function getTokenInfo(
    tokenId: number
) {

    const info = await rttContract.tokenInfo(
        tokenId
    );

    return {
        status: Number(info.status),
        matchId: info.matchId,
        fromRTBTokenId: Number(info.fromRTBTokenId),
        mintedAt: Number(info.mintedAt),
        issuedAt: Number(info.issuedAt)
    };

}

// ==========================
// Kiểm tra RTT còn tồn tại
// ==========================
export async function exists(
    tokenId: number
): Promise<boolean> {

    try {

        await rttContract.ownerOf(
            tokenId
        );

        return true;

    } catch {

        return false;

    }

}

// ==========================
// Token ID tiếp theo
// ==========================
export async function getNextTokenId(): Promise<number> {

    const id =
        await rttContract.nextTokenId();

    return Number(id);

}

// ==========================
// Kiểm tra Operator
// ==========================
export async function isOperator(
    address: string
): Promise<boolean> {

    const role =
        await rttContract.OPERATOR_ROLE();

    return await rttContract.hasRole(
        role,
        address
    );

}

// ==========================
// Kiểm tra Minter
// ==========================
export async function isMinter(
    address: string
): Promise<boolean> {

    const role =
        await rttContract.MINTER_ROLE();

    return await rttContract.hasRole(
        role,
        address
    );

}

// ==========================
// Kiểm tra Admin
// ==========================
export async function isAdmin(
    address: string
): Promise<boolean> {

    const role =
        await rttContract.DEFAULT_ADMIN_ROLE();

    return await rttContract.hasRole(
        role,
        address
    );

}

// ==========================
// Tên Collection
// ==========================
export async function getName(): Promise<string> {

    return await rttContract.name();

}

// ==========================
// Symbol
// ==========================
export async function getSymbol(): Promise<string> {

    return await rttContract.symbol();

}

// ==========================
// Địa chỉ Contract
// ==========================
export async function getContractAddress(): Promise<string> {

    return await rttContract.getAddress();

}