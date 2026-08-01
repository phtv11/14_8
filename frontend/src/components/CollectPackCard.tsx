import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { mintRTB } from "../services/api";

const matches = [
    {
        matchId: "FWC2026-001",
        teamA: "Brazil",
        teamB: "Argentina",
        date: "12/06/2026",
        stadium: "MetLife Stadium",
        category: "Round of 16"
    },
    {
        matchId: "FWC2026-002",
        teamA: "France",
        teamB: "Germany",
        date: "18/06/2026",
        stadium: "SoFi Stadium",
        category: "Quarter Final"
    },
    {
        matchId: "FWC2026-FINAL",
        teamA: "Finalist A",
        teamB: "Finalist B",
        date: "19/07/2026",
        stadium: "MetLife Stadium",
        category: "Final"
    }
];

type CheckoutStep = "select" | "payment" | "processing" | "success";

export default function CollectPackCard() {
    const navigate = useNavigate();
    const { address, connected, connect } = useWallet();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<CheckoutStep>("select");
    const [selectedMatchId, setSelectedMatchId] = useState("FWC2026-FINAL");
    const [message, setMessage] = useState("");
    const [txHash, setTxHash] = useState("");

    const selectedMatch = useMemo(
        () => matches.find((match) => match.matchId === selectedMatchId) ?? matches[0],
        [selectedMatchId]
    );

    async function goToPayment() {
        try {
            if (!connected) {
                await connect();
            }

            if (!address) {
                throw new Error("Wallet chưa được kết nối");
            }

            setStep("payment");
            setMessage("");
        } catch (error: any) {
            setMessage(error?.message || "Không thể kết nối ví");
        }
    }

    async function handleBuyPack() {
        try {
            if (!connected) {
                await connect();
            }

            if (!address) {
                throw new Error("Wallet chưa được kết nối");
            }

            setLoading(true);
            setMessage("");
            setTxHash("");
            setStep("processing");

            const response = await mintRTB(address, selectedMatch.matchId);
            const purchasePayload = {
                matchId: selectedMatch.matchId,
                label: `${selectedMatch.teamA} vs ${selectedMatch.teamB}`
            };

            localStorage.setItem("lastPurchasedRTB", JSON.stringify(purchasePayload));
            setTxHash(response.txHash || "");
            setMessage(`Mua pack RTB thành công cho ${selectedMatch.teamA} vs ${selectedMatch.teamB}.`);
            setStep("success");
        } catch (error: any) {
            setStep("payment");
            setMessage(error?.response?.data?.message || error.message || "Thanh toán không thành công");
        } finally {
            setLoading(false);
        }
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
                <p className="mt-3 text-slate-400">Chọn trận đấu, thanh toán và nhận ngay RTB NFT trong bộ sưu tập của bạn.</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <span className={step === "select" ? "text-sky-300" : "text-slate-500"}>1. Chọn trận</span>
                <ArrowRight size={14} />
                <span className={step === "payment" || step === "processing" ? "text-sky-300" : "text-slate-500"}>2. Thanh toán</span>
                <ArrowRight size={14} />
                <span className={step === "success" ? "text-sky-300" : "text-slate-500"}>3. Hoàn tất</span>
            </div>

            {step === "select" && (
                <div className="mt-8 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Chọn trận đấu</p>
                        <div className="grid gap-3">
                            {matches.map((match) => {
                                const active = selectedMatch.matchId === match.matchId;
                                return (
                                    <button
                                        key={match.matchId}
                                        onClick={() => setSelectedMatchId(match.matchId)}
                                        className={`rounded-2xl border px-4 py-3 text-left transition ${active ? "border-sky-400/50 bg-sky-500/10 text-white" : "border-white/10 bg-slate-900/60 text-slate-300"}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
                                                <p className="mt-1 text-xs text-slate-400">{match.category} • {match.date} • {match.stadium}</p>
                                            </div>
                                            {active && <CheckCircle2 size={18} className="text-sky-300" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={goToPayment}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]"
                    >
                        Buy Pack
                    </button>
                </div>
            )}

            {step === "payment" && (
                <div className="mt-8 rounded-[28px] border border-sky-400/20 bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Checkout</p>
                            <h3 className="mt-2 text-2xl font-semibold text-white">Thanh toán pack RTB</h3>
                        </div>
                        <button
                            onClick={() => setStep("select")}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-300"
                        >
                            <ArrowLeft size={16} />
                            Quay lại
                        </button>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
                        <div className="flex items-center justify-between border-b border-white/10 py-3">
                            <span>Pack</span>
                            <span className="font-semibold text-white">RTB NFT</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 py-3">
                            <span>Trận đấu</span>
                            <span className="font-semibold text-white">{selectedMatch.teamA} vs {selectedMatch.teamB}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 py-3">
                            <span>Ngày</span>
                            <span className="font-semibold text-white">{selectedMatch.date}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 py-3">
                            <span>Stadium</span>
                            <span className="font-semibold text-white">{selectedMatch.stadium}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span>Giá</span>
                            <span className="font-semibold text-white">$20</span>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                        <p className="font-semibold text-white">Thanh toán bằng ví của bạn</p>
                        <p className="mt-1 text-emerald-50/90">Sau khi xác nhận, RTB sẽ được mint và hiện trong My Collect.</p>
                    </div>

                    <button
                        onClick={handleBuyPack}
                        disabled={loading}
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Xác nhận thanh toán
                            </>
                        )}
                    </button>
                </div>
            )}

            {step === "processing" && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/80 p-6 text-center text-slate-300">
                    <Loader2 className="mx-auto animate-spin text-sky-300" size={32} />
                    <p className="mt-4 text-lg font-semibold text-white">Đang tiến hành thanh toán...</p>
                    <p className="mt-2 text-sm text-slate-400">Hệ thống đang ký giao dịch RTB trên blockchain cho trận {selectedMatch.teamA} vs {selectedMatch.teamB}.</p>
                </div>
            )}

            {step === "success" && (
                <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-center text-slate-300">
                    <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
                    <p className="mt-4 text-xl font-semibold text-white">Mua pack RTB thành công</p>
                    <p className="mt-2 text-sm text-slate-300">Bạn đã nhận RTB cho trận {selectedMatch.teamA} vs {selectedMatch.teamB}.</p>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-left text-sm text-slate-300">
                        <p>{message}</p>
                        {txHash && <p className="mt-2 break-all text-xs text-sky-300">Tx: {txHash}</p>}
                    </div>
                    <button
                        onClick={() => navigate("/collection")}
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20"
                    >
                        Xem My Collect
                    </button>
                </div>
            )}

            {message && (step !== "success" && step !== "processing") && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}