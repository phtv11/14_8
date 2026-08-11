import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { matches } from "../data/matches";
import { getUserRTBs } from "../services/contract";

export default function CollectPackCard() {
    const navigate = useNavigate();
    const { address, connected } = useWallet();
    const [message, setMessage] = useState("");
    const [ownedMatches, setOwnedMatches] = useState<Set<string>>(new Set());
    const [checkingOwned, setCheckingOwned] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadOwned() {
            if (!connected || !address) {
                setOwnedMatches(new Set());
                return;
            }

            setCheckingOwned(true);
            try {
                const rtbs = await getUserRTBs(address);
                if (!mounted) return;
                const set = new Set(rtbs.map((r: any) => r.matchId));
                setOwnedMatches(set);
            } catch (e) {
                console.error("Failed loading user RTBs", e);
            } finally {
                if (mounted) setCheckingOwned(false);
            }
        }

        void loadOwned();

        return () => {
            mounted = false;
        };
    }, [address, connected]);

    function goToPayment(match: typeof matches[0]) {
        if (!connected) {
            setMessage("Vui lòng kết nối ví.");
            return;
        }

        if (!address) {
            setMessage("Wallet chưa được kết nối");
            return;
        }

        setMessage("");
        navigate("/payment", { state: { purchaseMode: "pack", match } });
    }

    return (
        <div className="mx-auto max-w-xl rounded-[30px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-blue-500/15 p-4 text-blue-400">
                    <Gift size={64} />
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Limited drop</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">FIFA Collect Pack</h2>
                
            </div>

            <div className="mt-8 grid gap-4">
                {matches.map((match) => (
                    <div key={match.matchId} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                            <p className="mt-1 text-xs text-slate-400">{match.category} • {match.date} • {match.stadium}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-sm text-white font-semibold">$20</div>
                            {ownedMatches.has(match.matchId) ? (
                                <div className="rounded-full bg-emerald-600/80 px-4 py-2 font-semibold text-white">Already Purchased</div>
                            ) : (
                                <button
                                    onClick={() => void goToPayment(match)}
                                    disabled={checkingOwned}
                                    className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60"
                                >
                                    {checkingOwned ? "Checking..." : "Buy Pack"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {message && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}
