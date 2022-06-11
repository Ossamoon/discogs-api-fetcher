import { Artist } from "./types";
import { intersection } from "./lib";

const performerRoles: string[] = [
  "Piccolo Flute",
  "Flute",
  "Oboe",
  "Clarinet",
  "Bass Clarinet",
  "Bassoon",
  "Saxophone",
  "Soprano Saxophone",
  "Alto Saxophone",
  "Tenor Saxophone",
  "Baritone Saxophone",
  "Bass Saxophone",
  "Horn",
  "Alto Horn",
  "Baritone Horn",
  "French Horn",
  "Mellophone",
  "Trumpet",
  "Cornet",
  "Flugelhorn",
  "Trombone",
  "Bass Trombone",
  "Euphonium",
  "Tuba",
  "Ophicleide",
  "Drums",
  "Percussion",
  "Timpani",
  "Vibraphone",
  "Marimba",
  "Cimbalom",
  "Gong",
  "Congas",
  "Voice",
  "Vocals",
  "Backing Vocals",
  "Harp",
  "Piano",
  "Electric Piano",
  "Organ",
  "Keyboards",
  "Accordion",
  "Harmonica",
  "Melodica",
  "Harpsichord",
  "Bagpipes",
  "Guitar",
  "Electric Guitar",
  "Slide Guitar",
  "Bass Guitar",
  "Pedal Steel Guitar",
  "Banjo",
  "Mandolin",
  "Mandolin Banjo",
  "Tiple",
  "Tambura",
  "Sitar",
  "Ukulele",
  "Violin",
  "Viola",
  "Cello",
  "Bass",
  "Contrabass",
  "Double Bass",
  "Toy",
  "Toy Piano",
  "Lyricon",
  "Nadaswaram",
  "Featuring",
  "Performer",
];

const nonPerformerRoles: string[] = [
  "Conductor",
  "A&R",
  "Recording Supervisor",
  "Liner Notes",
  "Product Manager",
  "Creative Director",
  "Producer",
  "Executive-Producer",
  "Co-producer",
  "Coordinator",
  "Design",
  "Cover",
  "Graphics",
  "Painting",
  "Illustration",
  "Artwork",
  "Art Direction",
  "Engineer",
  "Technician",
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
  "Mixed By",
  "Remastered By",
];

export const getUnknownRoles = (roles: string[]): string[] => {
  const roleList = performerRoles.concat(nonPerformerRoles);
  return roles.filter((role) => roleList.includes(role) === false);
};

export const getRoles = (artist: Artist): string[] => {
  return artist.role
    .replace(/\[[^\[\]]*\]/g, "")
    .split(",")
    .map((str) => str.trim());
};

export const getPerformingRoles = (artist: Artist): string[] | undefined => {
  const roles = artist.role
    .replace(/\[[^\[\]]*\]/g, "")
    .split(",")
    .map((str) => str.trim());
  if (intersection<string>(roles, performerRoles).length > 0) {
    return intersection<string>(roles, performerRoles);
  }
  if (intersection<string>(roles, nonPerformerRoles).length > 0) {
    return [];
  }
  return undefined;
};
