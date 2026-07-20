export type SportId =
  | "baseball"
  | "soccer"
  | "basketball"
  | "volleyball"
  | "esports"
  | "other";

export type Sport = {
  id: SportId;
  name: string;
  order: number;
};

export type Team = {
  id: string;
  sportId: SportId;
  name: string;
  shortName?: string;
};

export type VenueTag = {
  id: string;
  label: string;
};
