import { useContext } from "react";
import { WalletContext } from "../contexts/WalletContext";

// ===============================
// Type cho Window Ethereum
// ===============================

declare global {
    interface Window {
        ethereum?: any;
    }
}


// ===============================
// Hook quản lý Wallet
// ===============================

export function useWallet() {
    const ctx = useContext(WalletContext);
    if (!ctx) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return ctx;
}
