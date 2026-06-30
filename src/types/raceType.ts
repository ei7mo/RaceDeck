export type Race = {
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      country: string;
    };
  };
  date: string;
  time: string;
};
