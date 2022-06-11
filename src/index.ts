import * as readline from "readline";
import { fetchMaster, fetchRelease, search } from "./fetch";
import { getPerformingRoles, getRoles, getUnknownRoles } from "./check";
import { Artist } from "./types";
import { sleep } from "./lib";

const logArtistRole = (artist: Artist): void => {
  const tab = `  `;

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

const getArtistsDataFromMasterId = async (
  master_id: number
): Promise<Artist[] | undefined> => {
  const master = await fetchMaster(master_id);
  const main_release = await fetchRelease(master.main_release);

  if (
    main_release.formats.some((format) =>
      format.descriptions.includes("Compilation")
    )
  ) {
    return undefined;
  }

  return main_release.extraartists;
};

const searchJazzMasters = async (page: number) => {
  const data = await search(page, "", "master", "Jazz", "Bop");
  return {
    masters: data.results.map((v) => ({
      id: v.id,
      title: v.title,
    })),
    pages: data.pagination.pages,
  };
};

const main = async () => {
  let page: number = 1;
  let unknownSet = new Set();

  while (true) {
    console.log(`Page ${page}`);
    const { masters, pages } = await searchJazzMasters(page);

    for (const master of masters) {
      await sleep(3000);
      console.log();
      console.log(`${master.title} [id=${master.id}]`);

      const artists = await getArtistsDataFromMasterId(master.id);
      if (artists === undefined) {
        console.log("Compilation Album.");
        continue;
      }
      if (artists.length < 2) {
        console.log("Credit doesn't have several artists.");
        continue;
      }

      for (const artist of artists) {
        const roles = getRoles(artist);
        console.log(artist.name, roles);

        const unknownRoles = getUnknownRoles(roles);
        if (unknownRoles.length !== 0) {
          console.warn(`Unknown Role: ${unknownRoles}`);
          unknownRoles.forEach((role) => {
            unknownSet.add(role);
          });
        }
      }
    }

    if (page >= pages) {
      break;
    } else {
      page++;
    }
  }

  console.log(unknownSet);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Return to start: ", () => {
  rl.close();
  main();
});
