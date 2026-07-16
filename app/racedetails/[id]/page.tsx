import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRaceByRound } from "@/apis/api";
import {
  getCountryCode,
  buildSchedule,
  groupSessionsByDay,
  formatTime,
} from "@/lib/raceHelpers";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = await getRaceByRound(id);

  if (!race) notFound();

  const country = race.Circuit.Location.country;
  const locality = race.Circuit.Location.locality;
  const code = getCountryCode(country);
  const isSprintWeekend = Boolean(race.Sprint);

  const schedule = buildSchedule(race);
  const now = Date.now();
  const nextIndex = schedule.findIndex((s) => s.start.getTime() >= now);
  const days = groupSessionsByDay(schedule);

  return (
    <main className="mx-auto max-w-2xl px-6 py-8 text-txt-primary">
      <Link
        href="/"
        className="text-sm text-txt-secondary transition hover:text-txt-primary"
      >
        ← Back to calendar
      </Link>

      <header className="mt-6 flex flex-col items-center gap-3 text-center">
        {code && (
          <Image
            src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
            alt={`${country} flag`}
            width={80}
            height={48}
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

export default Page;
