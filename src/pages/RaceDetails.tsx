import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { customList } from "country-codes-list";
import { getRaceByRound } from "../services/api";
import type { Race } from "../types/raceType";

const NAME_FALLBACK: Record<string, string> = {
  USA: "US",
  UK: "GB",
  UAE: "AE",
};

const SESSION_DEFS = [
  { key: "FirstPractice", label: "Practice 1" },
  { key: "SecondPractice", label: "Practice 2" },
  { key: "ThirdPractice", label: "Practice 3" },
  { key: "SprintQualifying", label: "Sprint Qualifying" },
  { key: "Sprint", label: "Sprint" },
  { key: "Qualifying", label: "Qualifying" },
] as const;

type SessionEntry = { label: string; start: Date; isRace: boolean };

const toDate = (date: string, time: string) => new Date(`${date}T${time}`);

const formatTime = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const formatDay = (d: Date) =>
  d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

function buildSchedule(race: Race): SessionEntry[] {
  const entries: SessionEntry[] = [];

  for (const { key, label } of SESSION_DEFS) {
    const session = race[key];
    if (session) {
      entries.push({
        label,
        start: toDate(session.date, session.time),
        isRace: false,
      });
    }
  }

  entries.push({
    label: "Race",
    start: toDate(race.date, race.time),
    isRace: true,
  });

  return entries.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function RaceDetails() {
  const { id } = useParams();
  const [race, setRace] = useState<Race | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getRaceByRound(id)
      .then(setRace)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const codeByCountry = useMemo(
    () => customList("countryNameEn", "{countryCode}"),
    [],
  );

  const backLink = (
    <Link
      to="/"
      className="text-sm text-txt-secondary transition hover:text-txt-primary"
    >
      ← Back to calendar
    </Link>
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-center text-txt-secondary">
        Loading race…
      </main>
    );
  }

  if (error || !race) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-center">
        <p className="text-f1-red">
          {error ? "Couldn't load this race." : "Race not found."}
        </p>
        <div className="mt-4">{backLink}</div>
      </main>
    );
  }

  const country = race.Circuit.Location.country;
  const locality = race.Circuit.Location.locality;
  const code = codeByCountry[country] ?? NAME_FALLBACK[country];
  const isSprintWeekend = Boolean(race.Sprint);

  const schedule = buildSchedule(race);
  const now = Date.now();
  const nextIndex = schedule.findIndex((s) => s.start.getTime() >= now);

  const days: { day: string; items: (SessionEntry & { index: number })[] }[] =
    [];
  schedule.forEach((entry, index) => {
    const day = formatDay(entry.start);
    let group = days.find((g) => g.day === day);
    if (!group) {
      group = { day, items: [] };
      days.push(group);
    }
    group.items.push({ ...entry, index });
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-8 text-txt-primary">
      {backLink}

      <header className="mt-6 flex flex-col items-center gap-3 text-center">
        {code && (
          <img
            src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
            alt={`${country} flag`}
            className="h-12 w-20 rounded object-cover ring-1 ring-border"
          />
        )}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-txt-secondary">
            Round {race.round}
            {isSprintWeekend && (
              <span className="ml-2 rounded-full bg-f1-red/15 px-2 py-0.5 text-f1-red">
                Sprint Weekend
              </span>
            )}
          </p>
          <h1 className="font-header text-4xl font-bold">{race.raceName}</h1>
          <p className="mt-1 text-txt-secondary">
            {race.Circuit.circuitName}
            {locality ? ` · ${locality}, ${country}` : ` · ${country}`}
          </p>
        </div>
      </header>

      <section className="mt-10 space-y-8">
        {days.map((group) => (
          <div key={group.day}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-txt-secondary">
              {group.day}
            </h2>
            <ul className="space-y-2">
              {group.items.map((item) => {
                const isPast = item.start.getTime() < now;
                const isNext = item.index === nextIndex;

                const borderClass = isNext
                  ? "border-next-race animate-pulse-glow"
                  : item.isRace
                    ? "border-f1-red"
                    : "border-border";

                return (
                  <li
                    key={item.label}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition ${borderClass} ${
                      item.isRace ? "bg-f1-red/10" : "bg-card"
                    } ${isPast && !item.isRace ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`font-semibold ${
                        item.isRace ? "font-header text-lg" : ""
                      }`}
                    >
                      {item.isRace ? "🏁 Race" : item.label}
                    </span>

                    <div className="flex items-center gap-3">
                      {isNext && (
                        <span className="rounded-full bg-next-race/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-next-race">
                          Next
                        </span>
                      )}
                      <span className="font-header text-lg font-bold">
                        {formatTime(item.start)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

export default RaceDetails;
