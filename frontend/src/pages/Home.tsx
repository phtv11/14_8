import { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import CollectPackCard from "../components/CollectPackCard";
import MatchCard from "../components/MatchCard";
import { matches as staticMatches } from "../data/matches";
import { getMatches } from "../services/api";

export default function Home() {
    const [matches, setMatches] = useState(staticMatches);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        void (async () => {
            setLoading(true);
            try {
                const result = await getMatches();
                const backendMatches = result.matches as Array<{ matchId: string; soldCount: number }>;
                const merged = staticMatches.map((match) => {
                    const backendMatch = backendMatches.find((m) => m.matchId === match.matchId);
                    return {
                        ...match,
                        soldCount: backendMatch?.soldCount ?? 0
                    };
                });
                setMatches(merged);
            } catch (error) {
                console.error("Failed loading matches", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <main className="flex w-full flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl">
                <HeroBanner />

                <section className="mx-auto w-full py-16">
                    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Launch your collection</p>
                            <h2 className="text-3xl font-bold text-white sm:text-4xl">FIFA Collect Pack</h2>
                            <p className="mt-2 max-w-2xl text-slate-400">Mint an RTB NFT and start building your official tournament portfolio.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                            Limited drop • Avalanche Fuji
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {matches.map((match) => (
                            <CollectPackCard
                                key={match.matchId}
                                match={match}
                            />
                        ))}
                    </div>
                    {loading && (
                        <div className="mt-6 text-sm text-slate-400">Loading pack supply data...</div>
                    )}
                </section>

                <section className="mx-auto w-full pb-16">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Featured schedule</p>
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Featured Matches</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {matches.map((match) => (
                            <MatchCard key={match.matchId} match={match} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}