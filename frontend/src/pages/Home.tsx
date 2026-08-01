import HeroBanner from "../components/HeroBanner";
import CollectPackCard from "../components/CollectPackCard";
import MatchCard from "../components/MatchCard";

export default function Home() {
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

                    <CollectPackCard />
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