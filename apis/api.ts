import type { Race } from "@/types/raceType";

const year = new Date().getFullYear();
const BASE_URL = `https://api.jolpi.ca/ergast/f1/${year}/races/`;

interface ErgastResponse {
  MRData: {
    RaceTable: {
      Races: Race[];
    };
  };
}

export async function getRaces(): Promise<Race[]> {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data: ErgastResponse = await response.json();

    return data.MRData.RaceTable.Races;
  } catch (error) {
    console.log("Failed to fetch races: ", error);

    throw error;
  }
}

export async function getRaceByRound(round: string): Promise<Race | undefined> {
  const races = await getRaces();

  return races.find((race) => race.round === round);
}
