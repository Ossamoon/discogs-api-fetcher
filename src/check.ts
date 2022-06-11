import { Artist } from "./types";
import { intersection } from "./lib";

const performerRoles: string[] = [
  "Piccolo Flute",
  "Alto Flute",
  "Flute",
  "Oboe",
  "Clarinet",
  "Bass Clarinet",
  "Bassoon",
  "Woodwind",
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
  "Timbales",
  "Gong",
  "Congas",
  "Bongos",
  "Cowbell",
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
  "Acoustic Guitar",
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
  "Electric Bass",
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
  "Research",
  "Restoration",
  "Recording Supervisor",
  "Liner Notes",
  "Sleeve Notes",
  "Product Manager",
  "Creative Director",
  "Producer",
  "Executive-Producer",
  "Co-producer",
  "Coordinator",
  "Interviewer",
  "Interviewee",
  "Editor",
  "Design",
  "Layout",
  "Cover",
  "Graphics",
  "Photography",
  "Painting",
  "Design Concept",
  "Illustration",
  "Artwork",
  "Art Direction",
  "Engineer",
  "Tape",
  "Remix",
  "Technician",
  "Written-By",
  "Artwork By",
  "Photography By",
  "Recorded By",
  "Lacquer Cut By",
  "Composed By",
  "Supervised By",
  "Mastered By",
  "Translated By",
  "Transferred By",
  "Arranged By",
  "Directed By",
  "Mixed By",
  "Remastered By",
  "Compiled By",
  "Edited By",
  "Hosted By",
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
