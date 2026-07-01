export type Session = {
  date: string;
  time: string;
};

export type Race = {
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      country: string;
      locality?: string;
    };
  };
  date: string;
  time: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  SprintQualifying?: Session;
  Sprint?: Session;
};
