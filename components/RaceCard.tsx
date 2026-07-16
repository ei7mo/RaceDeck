import Link from "next/link";
import Image from "next/image";
import {
  getCountryCode,
  getLocalRaceTime,
  getCountdownLabel,
  STATUS_STYLES,
  type RaceStatus,
} from "@/lib/raceHelpers";
import type { Race } from "@/types/raceType";

interface RaceCardProps {
  race: Race;
  isNext: boolean;
}

function RaceCard({ race, isNext }: RaceCardProps) {
  const country = race.Circuit.Location.country;
  const code = getCountryCode(country);
  const local = getLocalRaceTime(race.date, race.time);

  const status: RaceStatus = isNext
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
    <Link
      href={`/racedetails/${race.round}`}
      className={`flex h-full flex-col justify-between gap-4 rounded-2xl border-2 bg-card p-5 shadow-lg transition duration-300 hover:-translate-y-2 ${styles.card}`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-nav px-2 py-1 text-xs font-semibold uppercase tracking-wider text-txt-secondary">
          Round {race.round}
        </span>

        {code && (
          <Image
            src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
            alt={`${country} flag`}
            width={48}
            height={32}
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
    </Link>
  );
}

export default RaceCard;
