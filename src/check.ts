import { Artist } from "./types";
import { intersection } from "./lib";

const performerRoles: string[] = [
  "Flute",
  "Clarinet",
  "Saxophone",
  "Alto Saxophone",
  "Tenor Saxophone",
  "Trumpet",
  "Flugelhorn",
  "Trombone",
  "Tuba",
  "Drums",
  "Vibraphone",
  "Percussion",
  "Voice",
  "Piano",
  "Keyboards",
  "Guitar",
  "Bass",
];

const nonPerformerRoles: string[] = [
  "Liner Notes",
  "Producer",
  "Design",
  "Cover",
  "Engineer",
  "Written-By",
  "Photography By",
  "Recorded By",
  "Lacquer Cut By",
  "Composed By",
  "Supervised By",
  "Mastered By",
  "Translated By",
  "Arranged By",
  "Directed By",
];

export const getPerformingRoles = (artist: Artist): string[] | undefined => {
  const roles = artist.role
    .split(",")
    .map((str) => str.replace(/\[.*\]/g, "").trim());
  if (intersection<string>(roles, performerRoles).length > 0) {
    return intersection<string>(roles, performerRoles);
  }
  if (intersection<string>(roles, nonPerformerRoles).length > 0) {
    return [];
  }
  return undefined;
};
