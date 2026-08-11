import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import { mintRTB, createOrder } from "../services/api";
import { matches as defaultMatches } from "../data/matches";

interface MatchOption {
    matchId: string;
    teamA: string;
    teamB: string;
    date: string;
    stadium: string;
    category: string;
}

interface PaymentLocationState {
    purchaseMode?: "pack" | "rtb-right";
    match?: MatchOption;
    rtbTokenId?: number;
}

type CheckoutStep = "checkout" | "processing" | "success";

export default function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { address, connected } = useWallet();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<CheckoutStep>("checkout");
    const [message, setMessage] = useState("");
    const [txHash, setTxHash] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [seat, setSeat] = useState("");

    const paymentState = (location.state as PaymentLocationState | null) ?? {};
    const purchaseMode = paymentState.purchaseMode ?? "pack";
    const selectedMatch = useMemo(() => {
        return paymentState.match ?? defaultMatches[0];
    }, [paymentState.match]);

    const isRtbRightFlow = purchaseMode === "rtb-right";
    const pageTitle = isRtbRightFlow ? "Sử dụng quyền mua RTB" : "Thanh toán pack RTB";
    const successTitle = isRtbRightFlow ? "Sử dụng quyền mua RTB thành công" : "Mua pack RTB thành công";
    const successSubtitle = isRtbRightFlow
        ? `Bạn đã nhận RTB cho trận ${selectedMatch.teamA} vs ${selectedMatch.teamB}.`
        : `Bạn đã nhận RTB cho trận ${selectedMatch.teamA} vs ${selectedMatch.teamB}.`;

    async function handleConfirmPayment() {
        try {
            if (!connected) {
                setMessage("Vui lòng kết nối ví bằng nút Connect Wallet ở góc trên bên phải.");
                return;
            }

            if (!address) {
                setMessage("Wallet chưa được kết nối");
                return;
            }

            setLoading(true);
            setMessage("");
            setTxHash("");
            setStep("processing");

            if (isRtbRightFlow && (paymentState as PaymentLocationState).rtbTokenId) {
                const rtbTokenId = (paymentState as PaymentLocationState).rtbTokenId as number;
                const orderPayload = {
                    userAddress: address,
                    rtbTokenId,
                    matchId: selectedMatch.matchId,
                    category: selectedMatch.category,
                    seat: seat || "",
                    price: 20
                };

                const orderResp = await createOrder(orderPayload);

                const purchasePayload = {
                    matchId: selectedMatch.matchId,
                    label: `${selectedMatch.teamA} vs ${selectedMatch.teamB}`,
                    purchaseMode,
                    seat: seat || "",
                    orderId: orderResp?.orderId
                };

                localStorage.setItem("lastPurchasedRTB", JSON.stringify(purchasePayload));
                setMessage(`Thanh toán cho ${selectedMatch.teamA} vs ${selectedMatch.teamB} đã được ghi nhận. Order: ${orderResp?.orderId || "-"}`);
                setStep("success");
            } else {
                const response = await mintRTB(address, selectedMatch.matchId);
                const purchasePayload = {
                    matchId: selectedMatch.matchId,
                    label: `${selectedMatch.teamA} vs ${selectedMatch.teamB}`,
                    purchaseMode
                };

                localStorage.setItem("lastPurchasedRTB", JSON.stringify(purchasePayload));
                setTxHash(response.txHash || "");
                setMessage(`Mua pack RTB thành công cho ${selectedMatch.teamA} vs ${selectedMatch.teamB}.`);
                setStep("success");
            }
        } catch (error: any) {
            setStep("checkout");
            const resp = error?.response;
            if (resp && resp.status === 401) {
                setMessage(
                    "Unauthorized: backend API key missing or invalid. Set API_KEY (backend) and VITE_API_KEY (frontend)."
                );
            } else {
                setMessage(resp?.data?.message || error.message || "Thanh toán không thành công");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-300"
            >
                <ArrowLeft size={16} />
                Quay lại
            </button>

            <div className="mt-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Checkout</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{pageTitle}</h2>
                <p className="mt-3 text-slate-400">
                    {isRtbRightFlow
                        ? "Sử dụng quyền mua RTB của bạn để nhận ngay NFT cho trận đã chọn."
                        : "Xác nhận thanh toán để nhận RTB NFT cho trận đấu bạn đã chọn."}
                </p>
            </div>

            {step === "checkout" && (
                <div className="mt-8 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 text-sm text-slate-300">
                        <div className="flex items-center justify-between border-b border-white/10 py-3">
                            <span>Pack</span>
                            <span className="font-semibold text-white">{isRtbRightFlow ? "RTB quyền mua" : "RTB NFT"}</span>
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

                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                        <p className="mb-2 font-semibold text-white">Thông tin thanh toán</p>
                        <div className="grid gap-3">
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Họ và tên" className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-400" />
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-400" />
                            {isRtbRightFlow && (
                                <input value={seat} onChange={(e) => setSeat(e.target.value)} placeholder="Chỗ ngồi (ví dụ: A12)" className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-400" />
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                        <p className="font-semibold text-white">
                            {isRtbRightFlow ? "Thanh toán bằng quyền mua RTB" : "Thanh toán bằng ví của bạn"}
                        </p>
                        <p className="mt-1 text-emerald-50/90">
                            {isRtbRightFlow
                                ? "Sau khi xác nhận, RTB sẽ được mint và hiện trong My Collect."
                                : "Sau khi xác nhận, RTB sẽ được mint và hiện trong My Collect."}
                        </p>
                    </div>

                    <button
                        onClick={handleConfirmPayment}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                {isRtbRightFlow ? "Xác nhận sử dụng quyền mua" : "Xác nhận thanh toán"}
                            </>
                        )}
                    </button>
                </div>
            )}

            {step === "processing" && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/80 p-6 text-center text-slate-300">
                    <Loader2 className="mx-auto animate-spin text-sky-300" size={32} />
                    <p className="mt-4 text-lg font-semibold text-white">Đang tiến hành thanh toán...</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Hệ thống đang ký giao dịch RTB trên blockchain cho trận {selectedMatch.teamA} vs {selectedMatch.teamB}.
                    </p>
                </div>
            )}

            {step === "success" && (
                <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-center text-slate-300">
                    <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
                    <p className="mt-4 text-xl font-semibold text-white">{successTitle}</p>
                    <p className="mt-2 text-sm text-slate-300">{successSubtitle}</p>
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

            {message && step === "checkout" && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-sm text-slate-300">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}
