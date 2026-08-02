import { connectDB } from "../config/database";

export interface TokenIndexRow {
    collection: string; // 'RTB' | 'RTT'
    tokenId: number;
    owner: string;
    matchId?: string | null;
    mintedAt?: Date | null;
    txHash?: string | null;
    updatedAt?: Date;
}

export async function upsertTokenIndex(row: TokenIndexRow): Promise<void> {
    const pool = await connectDB();
    await pool.request()
        .input("collection", row.collection)
        .input("tokenId", row.tokenId)
        .input("owner", row.owner)
        .input("matchId", row.matchId || null)
        .input("mintedAt", row.mintedAt || null)
        .input("txHash", row.txHash || null)
        .query(`
            MERGE INTO [dbo].[token_index] AS target
            USING (SELECT @collection AS collection, @tokenId AS tokenId) AS source
            ON target.[collection] = source.collection AND target.[tokenId] = source.tokenId
            WHEN MATCHED THEN
                UPDATE SET [owner] = @owner, [matchId] = @matchId, [mintedAt] = @mintedAt, [txHash] = @txHash, [updatedAt] = GETDATE()
            WHEN NOT MATCHED THEN
                INSERT ([collection], [tokenId], [owner], [matchId], [mintedAt], [txHash], [updatedAt])
                VALUES (@collection, @tokenId, @owner, @matchId, @mintedAt, @txHash, GETDATE());
        `);
}

export async function findToken(collection: string, tokenId: number): Promise<TokenIndexRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("collection", collection)
        .input("tokenId", tokenId)
        .query(`
            SELECT TOP 1 * FROM [dbo].[token_index]
            WHERE [collection] = @collection AND [tokenId] = @tokenId;
        `);
    return result.recordset[0] || null;
}

export async function findTokensByOwner(collection: string, owner: string): Promise<TokenIndexRow[]> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("collection", collection)
        .input("owner", owner)
        .query(`
            SELECT * FROM [dbo].[token_index]
            WHERE [collection] = @collection AND [owner] = @owner
            ORDER BY [tokenId] ASC;
        `);
    return result.recordset || [];
}