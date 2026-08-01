import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Trophy } from "lucide-react";

export default function HeroBanner() {
    return (
        <section className="relative w-full overflow-hidden rounded-[32px] border border-white/10 px-4 py-20 shadow-2xl shadow-slate-950/20 sm:px-6 lg:px-8 lg:py-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.3),_transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(125deg,_rgba(2,6,23,0.95),_rgba(4,15,36,0.87))]" />

            <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
                    <Sparkles size={16} />
                    Premium FIFA World Cup experience
                </div>

                <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
                    FIFA World Cup 2026
                    <span className="mt-3 block bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Collect Experience
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
                    Own digital football collectibles, trade Right-to-Buy assets, and redeem official ticket rights on Avalanche.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link to="/collection" className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]">
                        Explore Collection
                    </Link>
                    <Link to="/ticket" className="rounded-full border border-white/15 bg-white/10 px-8 py-3.5 font-semibold text-slate-100 backdrop-blur transition hover:bg-white/20">
                        My Tickets
                    </Link>
                </div>

                <div className="mt-10 grid w-full gap-4 md:grid-cols-3">
                    {[
                        { icon: Trophy, title: "Official NFTs", text: "Collect rare tournament assets" },
                        { icon: ShieldCheck, title: "Secure Wallet", text: "Protected by your connected wallet" },
                        { icon: Sparkles, title: "Exclusive Access", text: "Unlock premium match experiences" }
                    ].map((item) => (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-left shadow-xl shadow-slate-950/20 backdrop-blur">
                            <item.icon className="mb-3 text-blue-400" size={22} />
                            <h3 className="font-semibold text-white">{item.title}</h3>
                            <p className="mt-2 text-sm text-slate-400">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}