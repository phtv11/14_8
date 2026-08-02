import { connectDB } from "../config/database";

export interface MatchRow {
    matchId: string;
    name: string;
    date: Date;
    stadium: string;
    totalSeats: number;
}

export async function createMatch(match: MatchRow): Promise<void> {
    const pool = await connectDB();
    await pool.request()
        .input("matchId", match.matchId)
        .input("name", match.name)
        .input("date", match.date)
        .input("stadium", match.stadium)
        .input("totalSeats", match.totalSeats)
        .query(`
            IF NOT EXISTS (
                SELECT 1 FROM [dbo].[matches] WHERE [matchId] = @matchId
            )
            BEGIN
                INSERT INTO [dbo].[matches] ([matchId], [name], [date], [stadium], [totalSeats])
                VALUES (@matchId, @name, @date, @stadium, @totalSeats);
            END
        `);
}

export async function findMatchById(matchId: string): Promise<MatchRow | null> {
    const pool = await connectDB();
    const result = await pool.request()
        .input("matchId", matchId)
        .query(`
            SELECT TOP 1 [matchId], [name], [date], [stadium], [totalSeats]
            FROM [dbo].[matches]
            WHERE [matchId] = @matchId;
        `);
    return result.recordset[0] || null;
}

export async function listMatches(): Promise<MatchRow[]> {
    const pool = await connectDB();
    const result = await pool.request()
        .query(`
            SELECT [matchId], [name], [date], [stadium], [totalSeats]
            FROM [dbo].[matches]
            ORDER BY [date] ASC;
        `);
    return result.recordset || [];
}
