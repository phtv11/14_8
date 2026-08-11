import { useEffect, useState } from "react";

import { Gift } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useWallet } from "../hooks/useWallet";

import { getUserRTBs } from "../services/contract";

type Match = {
    matchId: string;
    teamA: string;
    teamB: string;
    date: string;
    stadium: string;
    category: string;
};

interface CollectPackCardProps {
    match: Match;
}

export default function CollectPackCard({
    match,
}: CollectPackCardProps) {
    const navigate = useNavigate();

    const { address, connected } = useWallet();

    const [message, setMessage] = useState("");

    const [owned, setOwned] = useState(false);

    const [checkingOwned, setCheckingOwned] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadOwned() {
            if (!connected || !address) {
                setOwned(false);
                return;
            }

            setCheckingOwned(true);

            try {
                const rtbs = await getUserRTBs(address);

                if (!mounted) return;

                const alreadyOwned = rtbs.some(
                    (rtb: any) => rtb.matchId === match.matchId
                );

                setOwned(alreadyOwned);
            } catch (e) {
                console.error(
                    "Failed loading user RTBs",
                    e
                );
            } finally {
                if (mounted) {
                    setCheckingOwned(false);
                }
            }
        }

        void loadOwned();

        return () => {
            mounted = false;
        };
    }, [address, connected, match.matchId]);

    function goToPayment() {
        if (!connected) {
            setMessage("Vui lòng kết nối ví.");
            return;
        }

        if (!address) {
            setMessage("Wallet chưa được kết nối");
            return;
        }

        setMessage("");

        navigate("/payment", {
            state: {
                purchaseMode: "pack",
                match,
            },
        });
    }

    return (
        <div className="mx-auto w-full max-w-xl rounded-[30px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <div className="mb-6 flex justify-center">
                <div className="rounded-2xl bg-blue-500/15 p-4 text-blue-400">
                    <Gift size={64} />
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Limited drop
                </p>

                <h2 className="mt-2 text-3xl font-semibold text-white">
                    FIFA Collect Pack
                </h2>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/70 p-5 text-sm text-slate-300">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Match
                        </p>

                        <p className="mt-1 text-lg font-semibold text-white">
                            {match.teamA} vs {match.teamB}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Category
                            </p>

                            <p className="mt-1 text-slate-300">
                                {match.category}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Date
                            </p>

                            <p className="mt-1 text-slate-300">
                                {match.date}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                            Stadium
                        </p>

                        <p className="mt-1 text-slate-300">
                            {match.stadium}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Pack Price
                            </p>

                            <p className="mt-1 text-xl font-semibold text-white">
                                $20
                            </p>
                        </div>

                        {owned ? (
                            <div className="rounded-full bg-emerald-600/80 px-4 py-2 font-semibold text-white">
                                Already Purchased
                            </div>
                        ) : (
                            <button
                                onClick={() => void goToPayment()}
                                disabled={checkingOwned}
                                className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60"
                            >
                                {checkingOwned
                                    ? "Checking..."
                                    : "Buy Pack"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}