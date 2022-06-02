import { Artist } from "./types";
import { intersection } from "./lib";

const whiteRoles: string[] = ["Alto Saxophone", "Bass", "Drums", "Piano"];

const blackRoles: string[] = [
  "Lacquer Cut By",
  "Liner Notes",
  "Producer",
  "Design",
  "Photography By",
  "Recorded By",
];

export const getPerformingRoles = (artist: Artist): string[] | undefined => {
  const roles = artist.role.split(",").map((str) => str.trim());
  if (intersection<string>(roles, whiteRoles).length > 0) {
    return intersection<string>(roles, whiteRoles);
  }
  if (intersection<string>(roles, blackRoles).length > 0) {
    return [];
  }
  return undefined;
};
