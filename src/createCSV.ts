import { searchMaster, getArtistsDataFromMasterId } from "./fetch";
import {
  ArtistForm,
  ArtistToArtistForm,
  ArtistToMasterForm,
  MasterForm,
  readArtistToMasterFromCSV,
  writeArtistToArtistToCSV,
  writeArtistToMasterToCSV,
} from "./manageCSV";
import {
  readMastersFromCSV,
  writeMastersToCSV,
  writeArtistsToCSV,
} from "./manageCSV";
import { sleep } from "./lib";
import { Artist } from "./types";
import { hasPerformingRole, splitRoles } from "./check";

const QUERY = "";
const GENRE = "Jazz";
const STYLE = "Bop";

export const createMasterDatabase = async () => {
  let page: number = 1;
  let masters: MasterForm[] = [];

  while (page < 2) {
    // Search by genre and style.
    const { results, pagination } = await searchMaster(
      page,
      QUERY,
      GENRE,
      STYLE
    );
    console.log(`Page ${page}/${pagination.pages}`);

    // Results have 100 items of master data.
    results.forEach((master) => {
      // Extract master data.
      const { id, title, year, uri, thumb, cover_image } = master;
      masters.push({
        id: String(id),
        title: title,
        year: String(year),
        url: uri,
        thumb_image: thumb,
        cover_image: cover_image,
        status: "pending",
      });
    });

    // Escape the loop if it's the last page.
    if (page === pagination.pages) {
      break;
    } else {
      page++;
    }
  }

  await writeMastersToCSV(masters);
};

export const createArtistDatabase = async () => {
  let masters: MasterForm[] = await readMastersFromCSV(); // Get master data from CSV file.
  let artistMap = new Map<number, ArtistForm>();
  let artist2masterMap = new Map<number, ArtistToMasterForm>();

  for (let i = 0; i < masters.length; i++) {
    const master_id = Number(masters[i].id);
    console.log(`${i + 1}/${masters.length} id=${master_id}`);
    await sleep(5000);
    const [isCompilation, ...artists] = await getArtistsDataFromMasterId(
      master_id
    );

    if (isCompilation) {
      masters[i].status = "compilation";
      continue;
    }

    if (artists.length === 0) {
      masters[i].status = "no-credit";
      continue;
    }

    masters[i].status = "ok";

    artists.forEach((artist) => {
      artistMap.set(artist.id, {
        id: String(artist.id),
        name: artist.name,
        url: artist.resource_url,
      });

      const keyNum = artist.id * 1000000000 + master_id;
      const reserved = artist2masterMap.get(keyNum);
      if (reserved === undefined) {
        artist2masterMap.set(keyNum, {
          artist_id: String(artist.id),
          master_id: String(master_id),
          roles: artist.role,
        });
      } else {
        const { roles } = reserved;
        artist2masterMap.set(keyNum, {
          artist_id: String(artist.id),
          master_id: String(master_id),
          roles: roles + ", " + artist.role,
        });
      }
    });
  }

  await writeMastersToCSV(masters);
  await writeArtistsToCSV([...artistMap.values()]);
  await writeArtistToMasterToCSV([...artist2masterMap.values()]);
};

export const createConnectionDatabase = async () => {
  const masters = await readMastersFromCSV();
  const artist2master = await readArtistToMasterFromCSV();
  let artist2artistMap = new Map<number, ArtistToArtistForm>();

  for (const master of masters) {
    const master_id = master.id;
    const joinedArtistIDs = artist2master
      .filter((v) => v.master_id === master_id)
      .filter((v) => hasPerformingRole(splitRoles(v.roles)))
      .map((v) => v.artist_id);

    for (let i = 0; i < joinedArtistIDs.length; i++) {
      for (let j = i + 1; j < joinedArtistIDs.length; j++) {
        const [id_min, id_max] = [
          Number(joinedArtistIDs[i]),
          Number(joinedArtistIDs[j]),
        ].sort((a, b) => a - b);
        if (id_min === id_max) {
          throw new Error("Multiple same id's on one master " + master_id);
        }
        const key = id_max * 1000000000 + id_min;
        const reserved = artist2artistMap.get(key);
        if (reserved === undefined) {
          artist2artistMap.set(key, {
            id_min: String(id_min),
            id_max: String(id_max),
            masters: master_id,
          });
        } else {
          const { masters } = reserved;
          artist2artistMap.set(key, {
            id_min: String(id_min),
            id_max: String(id_max),
            masters: masters + "," + master_id,
          });
        }
      }
    }
  }

  await writeArtistToArtistToCSV([...artist2artistMap.values()]);
};
