import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { connectWallet } from "../services/contract";

type WalletContextType = {
    address: string | null;
    connected: boolean;
    loading: boolean;
    connect: () => Promise<void>;
    switchWallet: () => Promise<void>;
    disconnect: () => void;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    function clearWalletSessionData() {
        localStorage.removeItem("lastPurchasedRTB");
    }

    async function connect() {
        try {
            setLoading(true);
            clearWalletSessionData();
            const walletAddress = await connectWallet();
            setAddress(walletAddress);
            setConnected(true);
        } catch (error) {
            console.error("Connect wallet failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function switchWallet() {
        try {
            setLoading(true);
            clearWalletSessionData();
            const walletAddress = await connectWallet(true);
            setAddress(walletAddress);
            setConnected(true);
        } catch (error) {
            console.error("Switch wallet failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function disconnect() {
        clearWalletSessionData();
        setAddress(null);
        setConnected(false);
        if (window.location.pathname !== "/") {
            window.location.assign("/");
        }
    }

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts: string[]) => {
            clearWalletSessionData();
            if (accounts.length === 0) {
                setAddress(null);
                setConnected(false);
                window.location.assign("/");
            } else {
                setAddress(accounts[0]);
                setConnected(true);
                window.location.assign("/");
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            try {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleChainChanged);
            } catch (e) {
                /* noop */
            }
        };
    }, []);

    const value: WalletContextType = {
        address,
        connected,
        loading,
        connect,
        switchWallet,
        disconnect,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export default WalletProvider;
