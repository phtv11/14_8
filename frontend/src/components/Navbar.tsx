import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Trophy, Wallet, Sparkles, Menu, RefreshCw, LogOut } from "lucide-react";
import { useWallet } from "../hooks/useWallet";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "My Collect" },
    { to: "/ticket", label: "Tickets" },
    { to: "/marketplace", label: "Marketplace" }
];

export default function Navbar() {
    const { address, connected, loading, connect, switchWallet, disconnect } = useWallet();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    function shortAddress(address: string) {
        return address.slice(0, 6) + "..." + address.slice(-4);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleWalletAction(action: "switch" | "exit") {
        setMenuOpen(false);

        if (action === "switch") {
            try {
                await switchWallet();
            } catch (e: any) {
                alert(e?.message || "Failed to switch wallet");
            }
            return;
        }

        disconnect();
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
                    <div className="flex items-center gap-2">
                        {connected && address ? (
                            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300">
                                <Wallet size={16} />
                                {shortAddress(address)}
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    try {
                                        await connect();
                                    } catch (e: any) {
                                        alert(e?.message || "Failed to open wallet");
                                    }
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                            >
                                <Sparkles size={16} />
                                {loading ? "Connecting..." : "Connect Wallet"}
                            </button>
                        )}

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
                                aria-label="Open wallet menu"
                            >
                                <Menu size={18} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-xl">
                                    <button
                                        onClick={() => handleWalletAction("switch")}
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                                    >
                                        <RefreshCw size={16} />
                                        Đổi wallet
                                    </button>
                                    <button
                                        onClick={() => handleWalletAction("exit")}
                                        className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                                    >
                                        <LogOut size={16} />
                                        Exit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}