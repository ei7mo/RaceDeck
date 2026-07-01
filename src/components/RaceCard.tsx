import { useEffect, useMemo, useState } from "react";
import { getRaces } from "../services/api";
import type { Race } from "../types/raceType";
import { customList } from "country-codes-list";

const NAME_FALLBACK: Record<string, string> = {
  USA: "US",
  UK: "GB",
  UAE: "AE",
};

const DAY_MS = 24 * 60 * 60 * 1000;

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

function getCountdownLabel(start: Date) {
  const days = Math.round((start.getTime() - Date.now()) / DAY_MS);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  return `In ${Math.round(days / 7)} weeks`;
}

const STATUS_STYLES = {
  next: {
    card: "border-next-race animate-pulse-glow",
    badge: "bg-next-race/15 text-next-race",
  },
  finished: {
    card: "border-finshed-race opacity-70",
    badge: "bg-finshed-race/15 text-finshed-race",
  },
  upcoming: {
    card: "border-border",
    badge: "bg-nav text-txt-secondary",
  },
} as const;

type RaceStatus = keyof typeof STATUS_STYLES;

function RaceCard() {
  const [races, setRaces] = useState<Array<Race>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getRaces()
      .then(setRaces)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const codeByCountry = useMemo(
    () => customList("countryNameEn", "{countryCode}"),
    [],
  );

  const nextRound = useMemo(() => {
    const nowMs = Date.now();
    return races.find(
      (race) => getLocalRaceTime(race.date, race.time).start.getTime() >= nowMs,
    )?.round;
  }, [races]);

  if (loading) {
    return (
      <p className="col-span-full text-center text-txt-secondary">
        Loading races…
      </p>
    );
  }

  if (error) {
    return (
      <p className="col-span-full text-center text-f1-red">
        Couldn't load the race calendar. Please try again later.
      </p>
    );
  }

  if (races.length === 0) {
    return (
      <p className="col-span-full text-center text-txt-secondary">
        No races scheduled.
      </p>
    );
  }

  return (
    <>
      {races.map((race) => {
        const country = race.Circuit.Location.country;
        const code = codeByCountry[country] ?? NAME_FALLBACK[country];
        const local = getLocalRaceTime(race.date, race.time);

        const status: RaceStatus =
          race.round === nextRound
            ? "next"
            : local.start.getTime() < Date.now()
              ? "finished"
              : "upcoming";

        const label =
          status === "next"
            ? "Next up"
            : status === "finished"
              ? "Finished"
              : getCountdownLabel(local.start);

        const styles = STATUS_STYLES[status];

        return (
          <section
            key={race.round}
            className={`flex h-full flex-col justify-between gap-4 rounded-2xl border-2 bg-card p-5 shadow-lg transition duration-300 hover:-translate-y-2 ${styles.card}`}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-nav px-2 py-1 text-xs font-semibold uppercase tracking-wider text-txt-secondary">
                Round {race.round}
              </span>
              {code && (
                <img
                  src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
                  alt={`${country} flag`}
                  width={48}
                  height={32}
                  loading="lazy"
                  className="h-8 w-12 rounded object-cover ring-1 ring-border"
                />
              )}
            </div>

            <div className="text-center">
              <h2 className="font-header text-2xl font-bold leading-tight text-txt-primary">
                {race.raceName}
              </h2>
              <p className="mt-1 text-sm text-txt-secondary">
                {race.Circuit.circuitName}
              </p>
              <p className="text-xs text-txt-secondary">{country}</p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badge}`}
              >
                {label}
              </span>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-txt-secondary">
                  {local.date}
                </p>
                <p className="font-header text-xl font-bold text-txt-primary">
                  {local.time}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

export default RaceCard;
