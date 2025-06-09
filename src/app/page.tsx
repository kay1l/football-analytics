"use client";

import { useEffect, useState } from "react";
import { LeagueSidebar } from "@/custom_components/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

type Competition = {
  id: number;
  name: string;
  emblemUrl?: string;
};

export default function DashboardPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [scorers, setScorers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch competitions initially
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await fetch(`/api/competitions`);
        const data = await res.json();
  
        console.log('Fetched competitions response:', data); // 🔍 Debug line
  
        if (!data || !Array.isArray(data.competitions)) {
          throw new Error("Invalid response format");
        }
  
        const competitionsMapped: Competition[] = data.competitions.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          emblemUrl: typeof comp.emblem === 'string' ? comp.emblem : undefined,
        }));
  
        setCompetitions(competitionsMapped);
        setSelectedLeagueId(competitionsMapped[0]?.id ?? null);
      } catch (err) {
        console.error("Failed to load competitions:", err);
        setError("Failed to load competitions.");
      }
    };
    fetchCompetitions();
  }, []);
  

  // Fetch league data when selection changes
  useEffect(() => {
    if (!selectedLeagueId) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [liveRes, standingsRes, scorersRes] = await Promise.all([
          fetch(`/api/live/${selectedLeagueId}`),
          fetch(`/api/standings/${selectedLeagueId}`),
          fetch(`/api/scorers/${selectedLeagueId}`),
        ]);

        const [liveData, standingsData, scorersData] = await Promise.all([
          liveRes.json(),
          standingsRes.json(),
          scorersRes.json(),
        ]);

        setMatches(liveData.matches || []);
        setStandings(standingsData.standings?.[0]?.table || []);
        setScorers(scorersData.scorers || []);
        setError(null);
      } catch (err) {
        setError("Error loading league data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedLeagueId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {competitions === undefined ? (
        <p>Loading leagues...</p>
      ) : (
        <LeagueSidebar
          competitions={competitions}
          selectedLeagueId={selectedLeagueId}
          onSelectLeague={setSelectedLeagueId}
        />
      )}

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Football Dashboard</h1>

        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            {/* Live Matches */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Live Matches</h2>
              {matches.length === 0 ? (
                <p>No live matches currently.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {matches.map((match) => (
                    <Card key={match.id}>
                      <CardContent className="p-4">
                        <p className="font-medium">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Score: {match.score.fullTime.home ?? 0} -{" "}
                          {match.score.fullTime.away ?? 0}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Standings */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Standings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2">#</th>
                      <th className="p-2">Team</th>
                      <th className="p-2">Points</th>
                      <th className="p-2">Won</th>
                      <th className="p-2">Lost</th>
                      <th className="p-2">Draw</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team) => (
                      <tr key={team.team.id} className="border-b">
                        <td className="p-2">{team.position}</td>
                        <td className="p-2">{team.team.name}</td>
                        <td className="p-2">{team.points}</td>
                        <td className="p-2">{team.won}</td>
                        <td className="p-2">{team.lost}</td>
                        <td className="p-2">{team.draw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Top Scorers */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Top Scorers</h2>
              <ul className="space-y-2">
                {scorers.map((player: any, i: number) => (
                  <li
                    key={i}
                    className="flex justify-between p-3 border rounded"
                  >
                    <span>
                      {player.player.name} ({player.team.name})
                    </span>
                    <span className="font-bold">{player.goals} goals</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
