import { Link, NavLink } from "react-router-dom";
import { Trophy, Wallet, Sparkles } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "My Collect" },
    { to: "/ticket", label: "Tickets" }
];

export default function Navbar() {
    const { address, connected, loading, connect, disconnect } = useWallet();

    function shortAddress(address: string) {
        return address.slice(0, 6) + "..." + address.slice(-4);
    }

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-3 text-lg font-semibold text-white sm:text-xl">
                    <span className="rounded-full bg-blue-500/15 p-2 text-blue-400">
                        <Trophy size={18} />
                    </span>
                    <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        FIFA Collect
                    </span>
                </Link>

                <div className="hidden flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isActive ? "bg-blue-500/20 text-blue-300" : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="ml-auto shrink-0">
                    {connected && address ? (
                        <button onClick={disconnect} className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300">
                            <Wallet size={16} />
                            {shortAddress(address)}
                        </button>
                    ) : (
                        <button onClick={connect} disabled={loading} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
                            <Sparkles size={16} />
                            {loading ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}