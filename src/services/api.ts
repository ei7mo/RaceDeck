import type { Race } from "../types/raceType";

const BASE_URL = "https://api.jolpi.ca/ergast/f1/2026/races/";

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
  } catch (err) {
    console.log("Failed to fetch races:", err);

    throw err;
  }
}
