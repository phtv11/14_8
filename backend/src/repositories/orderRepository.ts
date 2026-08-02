import { connectDB } from "../config/database";

export interface OrderRow {
    id: string;
    userId: string;
    matchId: string;
    category: string;
    seat: string;
    price: number;
    status: string;
    rtbTokenId?: number | null;
    rttTokenId?: number | null;
    txHash?: string | null;
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
        .input("idempotencyKey", order.idempotencyKey || null)
        .query(`
            INSERT INTO [dbo].[orders] (
                [id], [userId], [matchId], [category], [seat], [price], [status], [rtbTokenId], [rttTokenId], [txHash], [idempotencyKey]
            )
            VALUES (
                @id, @userId, @matchId, @category, @seat, @price, @status, @rtbTokenId, @rttTokenId, @txHash, @idempotencyKey
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

export async function updateOrderAfterMint(orderId: string, rtbTokenId: number, txHash: string): Promise<OrderRow | null> {
    const pool = await connectDB();
    await pool.request()
        .input("id", orderId)
        .input("rtbTokenId", rtbTokenId)
        .input("txHash", txHash)
        .query(`
            UPDATE [dbo].[orders]
            SET [rtbTokenId] = @rtbTokenId,
                [txHash] = @txHash,
                [status] = 'MINTED'
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

export async function updateOrderStatus(orderId: string, status: string, rttTokenId?: number): Promise<OrderRow | null> {
    const pool = await connectDB();
    const request = pool.request()
        .input("id", orderId)
        .input("status", status);

    let query = `
        UPDATE [dbo].[orders]
        SET [status] = @status
        WHERE [id] = @id;
    `;

    if (typeof rttTokenId === "number") {
        request.input("rttTokenId", rttTokenId);
        query = `
            UPDATE [dbo].[orders]
            SET [status] = @status,
                [rttTokenId] = @rttTokenId
            WHERE [id] = @id;
        `;
    }

    await request.query(query);
    return findOrderById(orderId);
}
