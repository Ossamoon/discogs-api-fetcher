import * as readline from "readline";
import { fetchMaster, fetchRelease } from "./fetch";
import { getPerformingRoles } from "./check";
import { Artist } from "./types";

const tab = `  `;

const logArtistRole = (artist: Artist): void => {
  if (artist.role === "") {
    console.error(tab, `${artist.name}: No Role`);
    return;
  }

  const performingRoles = getPerformingRoles(artist);
  if (performingRoles === undefined) {
    console.log(tab, `${artist.name}: \x1b[31m${undefined}\x1b[0m`);
    console.log(tab, tab, artist.role);
    return;
  }
  if (performingRoles.length === 0) {
    console.log(tab, `${artist.name}: Non Performer`);
    console.log(tab, tab, artist.role);
    return;
  }
  console.log(tab, `${artist.name}: ${performingRoles.join(", ")}`);
  console.log(tab, tab, artist.role);
  return;
};

const getArtistsDataFromMasterId = async (master_id: number) => {
  const master = await fetchMaster(master_id);

  console.log("id: ", master.id);
  console.log("title: ", master.title);
  console.log("main_release: ", master.main_release);

  const release_id = master.main_release;
  const release = await fetchRelease(release_id);

  console.log("Artists:");
  for (const artist of release.artists) {
    logArtistRole(artist);
  }

  console.log("ExtraArtists:");
  for (const artist of release.extraartists) {
    logArtistRole(artist);
  }
};

const main = () => {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("Input Master ID: ", (input: string) => {
    const master_id = Number(input);
    readline.close();
    getArtistsDataFromMasterId(master_id);
  });
};

main();
