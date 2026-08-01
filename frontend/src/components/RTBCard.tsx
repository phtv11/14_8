import { useState } from "react";
import { ArrowRightLeft, Ticket, Sparkles } from "lucide-react";
import { transferRTB, redeemRTB } from "../services/contract";

interface RTBProps {
    tokenId: number;
    matchId: string;
    owner: string;
}

export default function RTBCard({ tokenId, matchId, owner }: RTBProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleTransfer() {
        try {
            const receiver = window.prompt("Nhập địa chỉ ví nhận RTB:");
            if (!receiver) {
                return;
            }

            setLoading(true);
            const txHash = await transferRTB(receiver, tokenId);
            setMessage("Transfer thành công: " + txHash.substring(0, 12) + "...");
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleRedeem() {
        try {
            setLoading(true);
            const txHash = await redeemRTB(tokenId);
            setMessage("Redeem thành công: " + txHash.substring(0, 12) + "...");
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-[24px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Right to Buy</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">RTB #{tokenId}</h2>
                </div>
                <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-400">
                    <Ticket size={20} />
                </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
                <p>
                    Match: <span className="ml-1 font-medium text-white">{matchId}</span>
                </p>
                <p>
                    Owner:
                    <span className="mt-1 block break-all text-slate-300">{owner}</span>
                </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <button disabled={loading} onClick={handleTransfer} className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-800 px-4 py-3 font-medium text-slate-100 transition hover:bg-slate-700">
                    <ArrowRightLeft size={18} />
                    Transfer RTB
                </button>

                <button disabled={loading} onClick={handleRedeem} className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]">
                    <Sparkles size={18} />
                    Redeem RTB
                </button>
            </div>

            {message && <p className="mt-4 rounded-2xl border border-white/10 bg-slate-800/70 p-3 text-center text-sm text-slate-300">{message}</p>}
        </div>
    );
}