import { useEffect, useMemo, useState } from "react";
import { getRaces } from "../services/api";
import type { Race } from "../types/raceType";
import { customList } from "country-codes-list";

function RaceCard() {
  const [races, setRaces] = useState<Array<Race>>([]);

  const codeByCountry = useMemo(
    () => customList("countryNameEn", "{countryCode}"),
    [],
  );

  const NAME_FALLBACK: Record<string, string> = {
    USA: "US",
    UK: "GB",
    UAE: "AE",
  };

  function getLocalRaceTime(date: string, time: string) {
    const start = new Date(`${date}T${time}`);
    return {
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

  useEffect(() => {
    const loadRaces = async () => {
      const data = await getRaces();
      setRaces(data);
    };

    loadRaces();
  }, []);

  return (
    <>
      {races.map((race) => {
        const country = race.Circuit.Location.country;
        const code = codeByCountry[country] ?? NAME_FALLBACK[country];
        const local = getLocalRaceTime(race.date, race.time);

        return (
          <div
            className="bg-card flex flex-col items-center justify-between"
            key={race.round}
          >
            <h1 className="text-2xl mt-2.5">{race.raceName}</h1>
            {code && (
              <img
                src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
                alt={country}
              />
            )}
            <p className="mt-2.5 mb-6">{race.Circuit.circuitName}</p>
            <span>{race.date}</span>
            <span className="mb-2.5">{local.time}</span>
          </div>
        );
      })}
    </>
  );
}

export default RaceCard;
