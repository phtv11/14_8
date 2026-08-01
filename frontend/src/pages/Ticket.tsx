import { useEffect, useState } from "react";
import RTTCard from "../components/RTTCard";
import { useWallet } from "../hooks/useWallet";
import { getUserRTTs } from "../services/contract";

interface RTT {
    tokenId: number;
    matchId: string;
    status: string;
    ticketRef?: string;
}

export default function Ticket() {
    const { address, connected, connect } = useWallet();
    const [tickets, setTickets] = useState<RTT[]>([]);
    const [loading, setLoading] = useState(false);

    async function loadTickets() {
        try {
            if (!address) {
                return;
            }

            setLoading(true);
            const data = await getUserRTTs(address);
            setTickets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTickets();
    }, [address]);

    if (!connected) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4 py-16">
                <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-900/70 p-10 text-center shadow-2xl shadow-slate-950/30 backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Ticket portal</p>
                    <h1 className="mt-3 text-4xl font-bold text-white">My Tickets</h1>
                    <p className="mt-4 text-slate-400">Connect your wallet to explore your verified ticket rights and RTTs.</p>
                    <button onClick={connect} className="mt-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/20">
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen w-full justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl">
                <div className="mb-10 rounded-[28px] border border-white/10 bg-slate-900/65 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Ticket hub</p>
                            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">My Tickets</h1>
                            <p className="mt-3 max-w-2xl text-slate-400">Review your RTT tokens and keep track of their status and ticket references.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-300">
                            Connected wallet: <span className="ml-1 font-medium text-white">{address}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
                        Loading ticket data...
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {tickets.length === 0 ? (
                            <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-8 text-slate-300">
                                No ticket found.
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <RTTCard key={ticket.tokenId} tokenId={ticket.tokenId} matchId={ticket.matchId} status={ticket.status} ticketRef={ticket.ticketRef} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}