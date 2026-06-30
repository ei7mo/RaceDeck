import { useEffect, useMemo, useState } from "react";
import { getRaces } from "../services/api";
import type { Race } from "../types/raceType";
import { customList } from "country-codes-list";

function RaceCard() {
  const [races, setRaces] = useState<Array<Race>>([]);

  useEffect(() => {
    const loadRaces = async () => {
      const data = await getRaces();
      setRaces(data);
    };

    loadRaces();
  }, []);

  const codeByCountry = useMemo(
    () => customList("countryNameEn", "{countryCode}"),
    [],
  );

  const NAME_FALLBACK: Record<string, string> = {
    USA: "US",
    UK: "GB",
    UAE: "AE",
  };

  const now = Date.now();
  const nextRound = races.find(
    (race) => getLocalRaceTime(race.date, race.time).start.getTime() >= now,
  )?.round;

  function getLocalRaceTime(date: string, time: string) {
    const start = new Date(`${date}T${time}`);
    return {
      start,
      date: start.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      time: start.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  return (
    <>
      {races.map((race) => {
        const country = race.Circuit.Location.country;
        const code = codeByCountry[country] ?? NAME_FALLBACK[country];
        const local = getLocalRaceTime(race.date, race.time);
        const isNext = race.round === nextRound;
        const isFinished = local.start.getTime() < now;

        const border = isNext
          ? "border-next-race shadow-next-race animate-pulse-glow"
          : isFinished
            ? "border-finshed-race shadow-finshed-race"
            : "border-border";

        return (
          <div
            className={`bg-card w-full h-80 flex flex-col justify-between items-center p-6 rounded-xl border-3 ${border} shadow-lg hover:-translate-y-4 transition`}
            key={race.round}
          >
            <h1 className="text-2xl">{race.raceName}</h1>
            {code && (
              <img
                src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
                alt={country}
              />
            )}
            <p className="text-txt-secondary">{race.Circuit.circuitName}</p>
            <div className="flex flex-col items-center bg-f1-red px-5 py-2 rounded-xl shadow-md border-3 border-border">
              <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                {local.date}
              </span>
              <span className="font-header text-2xl font-bold leading-tight">
                {local.time}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default RaceCard;
