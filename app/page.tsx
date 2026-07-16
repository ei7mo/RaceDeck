import { getRaces } from "@/apis/api";
import RaceCard from "@/components/RaceCard";
import { getNextRound } from "@/lib/raceHelpers";

export default async function Home() {
  const races = await getRaces();
  const nextRound = getNextRound(races);

  console.log(nextRound);
  return (
    <main className="text-txt-primary grid grid-cols-1 md:grid-cols-2 md:grid-row-11 xl:grid-cols-4 xl:grid-rows-6 gap-10 my-7 mx-6">
      {races.map((race) => (
        <RaceCard
          key={race.round}
          race={race}
          isNext={race.round === nextRound}
        />
      ))}
    </main>
  );
}
