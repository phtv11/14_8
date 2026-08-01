import { CalendarDays, MapPin, Trophy } from "lucide-react";

interface Match {
    matchId: string;
    teamA: string;
    teamB: string;
    date: string;
    stadium: string;
    category: string;
}

interface Props {
    match: Match;
}

export default function MatchCard({ match }: Props) {
    return (
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/25 backdrop-blur transition hover:-translate-y-1">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                <div className="mb-3 flex items-center justify-center">
                    <div className="rounded-full bg-white/15 p-2">
                        <Trophy size={18} />
                    </div>
                </div>
                <h3 className="text-center text-xl font-semibold">FIFA World Cup 2026</h3>
                <p className="mt-2 text-center text-sm text-blue-50">{match.category}</p>
            </div>

            <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 text-lg font-semibold text-white">
                    <span>{match.teamA}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">VS</span>
                    <span>{match.teamB}</span>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                        <CalendarDays size={16} className="text-sky-300" />
                        <span>{match.date}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <MapPin size={16} className="text-sky-300" />
                        <span>{match.stadium}</span>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-sm text-slate-300">
                    Match ID: <span className="ml-1 font-medium text-white">{match.matchId}</span>
                </div>
            </div>
        </div>
    );
}