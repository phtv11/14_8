import { TicketCheck } from "lucide-react";

interface RTTProps {
    tokenId: number;
    matchId: string;
    status: string;
    ticketRef?: string;
}

export default function RTTCard({ tokenId, matchId, status, ticketRef }: RTTProps) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Right to Ticket</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">RTT #{tokenId}</h2>
                </div>
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                    <TicketCheck size={20} />
                </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
                <p>
                    Match: <span className="ml-1 font-medium text-white">{matchId}</span>
                </p>
                <p>
                    Status:
                    <span className="ml-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                        {status}
                    </span>
                </p>
                {ticketRef && (
                    <p>
                        Ticket Ref:
                        <span className="mt-1 block break-all text-slate-300">{ticketRef}</span>
                    </p>
                )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-400">
                RTT is soulbound. This token cannot be transferred.
            </div>
        </div>
    );
}