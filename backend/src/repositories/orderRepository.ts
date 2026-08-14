import { connectDB } from "../config/database";

export interface OrderRow {
    id: string;
    userId: string;
    matchId: string;
    category: string | null;
    seat: string | null;
    price: number;
    status: string;
    rtbTokenId?: number | null;
    rttTokenId?: number | null;
    txHash?: string | null;
    paymentTxHash?: string | null;
    mintTxHash?: string | null;
    paymentVerifiedAt?: Date | null;
    idempotencyKey?: string | null;
    createdAt?: Date;
}

export async function createOrder(order: OrderRow): Promise<OrderRow> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id", order.id)
        .input("userId", order.userId)
        .input("matchId", order.matchId)
        .input("category", order.category)
        .input("seat", order.seat)
        .input("price", order.price)
        .input("status", order.status)
        .input("rtbTokenId", order.rtbTokenId || null)
        .input("rttTokenId", order.rttTokenId || null)
        .input("txHash", order.txHash || null)
        .input("paymentTxHash", order.paymentTxHash || null)
        .input("mintTxHash", order.mintTxHash || null)
        .input("paymentVerifiedAt", order.paymentVerifiedAt || null)
        .input("idempotencyKey", order.idempotencyKey || null)
        .query(`
            INSERT INTO [dbo].[orders] (
                [id], [userId], [matchId], [category], [seat], [price], [status], [rtbTokenId], [rttTokenId], [txHash], [paymentTxHash], [mintTxHash], [paymentVerifiedAt], [idempotencyKey]
            )
            VALUES (
                @id, @userId, @matchId, @category, @seat, @price, @status, @rtbTokenId, @rttTokenId, @txHash, @paymentTxHash, @mintTxHash, @paymentVerifiedAt, @idempotencyKey
            );

            SELECT TOP 1 * FROM [dbo].[orders] WHERE [id] = @id;
        `);
    return result.recordset[0];
}

export async function findOrderById(orderId: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("id", orderId)
        .query(`
            SELECT TOP 1 *
            FROM [dbo].[orders]
            WHERE [id] = @id;
        `);
    return result.recordset[0] || null;
}

export async function findOrderByIdempotencyKey(idempotencyKey: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("idempotencyKey", idempotencyKey)
        .query(`
            SELECT TOP 1 *
            FROM [dbo].[orders]
            WHERE [idempotencyKey] = @idempotencyKey;
        `);
    return result.recordset[0] || null;
}

export async function findOrderByRtbTokenId(rtbTokenId: number): Promise<OrderRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("rtbTokenId", rtbTokenId)
        .query(`
            SELECT TOP 1 *
            FROM [dbo].[orders]
            WHERE [rtbTokenId] = @rtbTokenId;
        `);
    return result.recordset[0] || null;
}
export async function findOrderByPaymentTxHash(paymentTxHash: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("paymentTxHash", paymentTxHash)
        .query(`
            SELECT TOP 1 *
            FROM [dbo].[orders]
            WHERE [paymentTxHash] = @paymentTxHash;
        `);
    return result.recordset[0] || null;
}
export async function findOrderByRttTokenId(rttTokenId: number): Promise<OrderRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("rttTokenId", rttTokenId)
        .query(`
            SELECT TOP 1 *
            FROM [dbo].[orders]
            WHERE [rttTokenId] = @rttTokenId;
        `);
    return result.recordset[0] || null;
}

export async function updateOrderAfterPaymentVerification(orderId: string, paymentTxHash: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    await pool.request()
        .input("id", orderId)
        .input("paymentTxHash", paymentTxHash)
        .input("paymentVerifiedAt", new Date())
        .query(`
            UPDATE [dbo].[orders]
            SET [paymentTxHash] = @paymentTxHash,
                [paymentVerifiedAt] = @paymentVerifiedAt,
                [status] = 'PAID'
            WHERE [id] = @id;
        `);
    return findOrderById(orderId);
}

export async function updateOrderAfterMint(orderId: string, rtbTokenId: number, mintTxHash: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    await pool.request()
        .input("id", orderId)
        .input("rtbTokenId", rtbTokenId)
        .input("mintTxHash", mintTxHash)
        .query(`
            UPDATE [dbo].[orders]
            SET [rtbTokenId] = @rtbTokenId,
                [mintTxHash] = @mintTxHash,
                [status] = 'COMPLETED'
            WHERE [id] = @id;
        `);
    return findOrderById(orderId);
}

export async function updateOrderAfterIssue(orderId: string, rttTokenId: number): Promise<OrderRow | null> {
    const pool = await connectDB();
    await pool.request()
        .input("id", orderId)
        .input("rttTokenId", rttTokenId)
        .query(`
            UPDATE [dbo].[orders]
            SET [rttTokenId] = @rttTokenId,
                [status] = 'ISSUED'
            WHERE [id] = @id;
        `);
    return findOrderById(orderId);
}

export async function updateOrderStatus(
    orderId: string,
    status: string,
    rttTokenId?: number,
    category?: string | null,
    seat?: string | null
): Promise<OrderRow | null> {
    const pool = await connectDB();
    const request = pool.request()
        .input("id", orderId)
        .input("status", status);

    let query = `
        UPDATE [dbo].[orders]
        SET [status] = @status
        WHERE [id] = @id;
    `;

    if (typeof rttTokenId === "number" || category !== undefined || seat !== undefined) {
        let setClauses = ["[status] = @status"];

        if (typeof rttTokenId === "number") {
            request.input("rttTokenId", rttTokenId);
            setClauses.push("[rttTokenId] = @rttTokenId");
        }

        if (category !== undefined) {
            request.input("category", category);
            setClauses.push("[category] = @category");
        }

        if (seat !== undefined) {
            request.input("seat", seat);
            setClauses.push("[seat] = @seat");
        }

        query = `
            UPDATE [dbo].[orders]
            SET ${setClauses.join(", ")}
            WHERE [id] = @id;
        `;
    }

    await request.query(query);
    return findOrderById(orderId);
}

export async function findOrdersByUser(userAddress: string): Promise<OrderRow[]> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("userId", userAddress)
        .query(`
            SELECT *
            FROM [dbo].[orders]
            WHERE [userId] = @userId
            ORDER BY [createdAt] DESC;
        `);
    return result.recordset;
}
