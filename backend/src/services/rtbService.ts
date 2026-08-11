import { ethers } from "ethers";
import dotenv from "dotenv";
import { wallet } from "../config/blockchain";
import RTB from "../contracts/FIFARTB.json";

dotenv.config({ override: true });

function getRTBContract() {
    dotenv.config({ override: true });

    const rtbAddress = process.env.RTB_ADDRESS;
    if (!rtbAddress) {
        throw new Error("RTB_ADDRESS chưa được cấu hình");
    }

    return new ethers.Contract(
        rtbAddress,
        RTB.abi,
        wallet
    );
}

// ==========================
// Mint RTB (Backend ký)
// ==========================
export async function mintRTB(
    to: string,
    matchId: string
): Promise<{ txHash: string; tokenId: number }> {

    const rtbContract = getRTBContract();

    // Determine next tokenId before mint to know which token will be minted
    const tokenId = await getNextTokenId();

    const tx = await rtbContract.mintRTB(
        to,
        matchId
    );

    await tx.wait();

    return { txHash: tx.hash, tokenId };
}

// ==========================
// Lấy chủ sở hữu RTB
// ==========================
export async function ownerOf(
    tokenId: number
): Promise<string> {
    const rtbContract = getRTBContract();

    return await rtbContract.ownerOf(
        tokenId
    );
}

// ==========================
// Lấy thông tin RTB
// ==========================
export async function getTokenInfo(
    tokenId: number
) {
    const rtbContract = getRTBContract();

    const info = await rtbContract.tokenInfo(
        tokenId
    );

    return {
        matchId: info.matchId,
        mintedAt: Number(info.mintedAt)
    };

}

// ==========================
// Kiểm tra token còn tồn tại
// (Nếu đã redeem thì ownerOf sẽ revert)
// ==========================
export async function exists(
    tokenId: number
): Promise<boolean> {
    const rtbContract = getRTBContract();

    try {

        await rtbContract.ownerOf(
            tokenId
        );

        return true;

    } catch {

        return false;

    }

}

// ==========================
// Lấy tokenId sẽ được mint tiếp theo
// ==========================
export async function getNextTokenId(): Promise<number> {
    const rtbContract = getRTBContract();

    const id =
        await rtbContract.nextTokenId();

    return Number(id);

}

// ==========================
// Lấy địa chỉ RTT Contract
// ==========================
export async function getRTTContract(): Promise<string> {
    const rtbContract = getRTBContract();

    return await rtbContract.rttContract();

}

// ==========================
// Kiểm tra quyền Operator
// ==========================
export async function isOperator(
    address: string
): Promise<boolean> {
    const rtbContract = getRTBContract();

    const role =
        await rtbContract.OPERATOR_ROLE();

    return await rtbContract.hasRole(
        role,
        address
    );

}

// ==========================
// Kiểm tra quyền Admin
// ==========================
export async function isAdmin(
    address: string
): Promise<boolean> {
    const rtbContract = getRTBContract();

    const role =
        await rtbContract.DEFAULT_ADMIN_ROLE();

    return await rtbContract.hasRole(
        role,
        address
    );

}

// ==========================
// Lấy tên Collection
// ==========================
export async function getName(): Promise<string> {
    const rtbContract = getRTBContract();

    return await rtbContract.name();

}

// ==========================
// Lấy Symbol
// ==========================
export async function getSymbol(): Promise<string> {
    const rtbContract = getRTBContract();

    return await rtbContract.symbol();

}

// ==========================
// Lấy địa chỉ Contract
// ==========================
export async function getContractAddress(): Promise<string> {
    const rtbContract = getRTBContract();

    return await rtbContract.getAddress();

}