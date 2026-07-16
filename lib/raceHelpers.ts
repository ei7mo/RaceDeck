import { Race } from "@/types/raceType";
import { customList } from "country-codes-list";

const DAY_MS = 24 * 60 * 60 * 1000;

const NAME_FALLBACK: Record<string, string> = {
  USA: "US",
  UK: "GB",
  UAE: "AE",
};

const codeByCountry = customList("countryNameEn", "{countryCode}");

export function getCountryCode(country: string) {
  return codeByCountry[country] ?? NAME_FALLBACK[country];
}

export function getLocalRaceTime(date: string, time: string) {
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

export function getCountdownLabel(start: Date) {
  const days = Math.round((start.getTime() - Date.now()) / DAY_MS);

  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;

  return `In ${Math.round(days / 7)} weeks`;
}

export const STATUS_STYLES = {
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

export type RaceStatus = keyof typeof STATUS_STYLES;

export function getNextRound(races: Race[]) {
  const nowMs = Date.now();

  return races.find(
    (race) => getLocalRaceTime(race.date, race.time).start.getTime() >= nowMs,
  )?.round;
}

const SESSION_DEFS = [
  { key: "FirstPractice", label: "Practice 1" },
  { key: "SecondPractice", label: "Practice 2" },
  { key: "ThirdPractice", label: "Practice 3" },
  { key: "SprintQualifying", label: "Sprint Qualifying" },
  { key: "Sprint", label: "Sprint" },
  { key: "Qualifying", label: "Qualifying" },
] as const;

export type SessionEntry = { label: string; start: Date; isRace: boolean };

const toDate = (date: string, time: string) => new Date(`${date}T${time}`);

export function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function formatDay(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function buildSchedule(race: Race): SessionEntry[] {
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

export type DayGroup = {
  day: string;
  items: (SessionEntry & { index: number })[];
};

export function groupSessionsByDay(schedule: SessionEntry[]): DayGroup[] {
  const days: DayGroup[] = [];

  schedule.forEach((entry, index) => {
    const day = formatDay(entry.start);
    let group = days.find((g) => g.day === day);
    if (!group) {
      group = { day, items: [] };
      days.push(group);
    }
    group.items.push({ ...entry, index });
  });

  return days;
}
