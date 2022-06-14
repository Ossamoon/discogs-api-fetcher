import {
  searchMaster,
  fetchMaster,
  getArtistsDataFromReleaseId,
  fetchArtist,
} from "./fetch";
import {
  ArtistForm,
  ArtistToArtistForm,
  ArtistToMasterForm,
  MasterForm,
  readArtistsFromCSV,
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
import { hasPerformingRole, splitRoles } from "./check";

const QUERY = "";
const GENRE = "Jazz";
const STYLE = "Bop";

export const createMasterDatabase = async () => {
  let page: number = 1;
  let masters: MasterForm[] = [];

  while (page < 3) {
    // Search by genre and style.
    const { results, pagination } = await searchMaster(
      page,
      QUERY,
      GENRE,
      STYLE
    );
    console.log(`Page ${page}/${pagination.pages}`);
    await sleep(2500);

    // Results have 100 items of master data.
    results.forEach((master) => {
      // Extract master data.
      const { id, title, year, thumb, cover_image } = master;
      masters.push({
        master_id: id,
        title: title,
        year: year,
        thumb_image: thumb,
        cover_image: cover_image,
        release_id: -1,
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

export const updateMasterDatabese = async () => {
  let masters: MasterForm[] = await readMastersFromCSV();
  for (let i = 0; i < masters.length; i++) {
    console.log(`${i + 1}/${masters.length} id=${masters[i].master_id}`);
    if (masters[i].release_id !== -1) {
      continue;
    }
    await sleep(2500);
    const { main_release } = await fetchMaster(masters[i].master_id);
    masters[i].release_id = main_release;
  }
  await writeMastersToCSV(masters);
};

export const createArtistDatabase = async () => {
  let masters: MasterForm[] = await readMastersFromCSV(); // Get master data from CSV file.
  let artistMap = new Map<number, ArtistForm>();
  let artist2masterMap = new Map<number, ArtistToMasterForm>();

  for (let i = 0; i < masters.length; i++) {
    console.log(`${i + 1}/${masters.length} id=${masters[i].master_id}`);
    await sleep(2500);
    const [isCompilation, ...artists] = await getArtistsDataFromReleaseId(
      masters[i].release_id
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
        id: artist.id,
        name: artist.name,
        thumb_image: "",
        main_image: "",
        is_performer: -1,
      });

      const keyNum = artist.id * 1000000000 + masters[i].master_id;
      const pre_data = artist2masterMap.get(keyNum);
      if (pre_data === undefined) {
        artist2masterMap.set(keyNum, {
          artist_id: artist.id,
          master_id: masters[i].master_id,
          roles: artist.role,
        });
      } else {
        const { roles } = pre_data;
        artist2masterMap.set(keyNum, {
          artist_id: artist.id,
          master_id: masters[i].master_id,
          roles: roles + ", " + artist.role,
        });
      }
    });
  }

  await writeMastersToCSV(masters);
  await writeArtistsToCSV([...artistMap.values()]);
  await writeArtistToMasterToCSV([...artist2masterMap.values()]);
};

export const updateArtistDatabase = async () => {
  let artists: ArtistForm[] = await readArtistsFromCSV();
  const artist2master: ArtistToMasterForm[] = await readArtistToMasterFromCSV();

  for (let i = 0; i < artists.length; i++) {
    console.log(`${i + 1}/${artists.length} id=${artists[i].id}`);

    // Update image source
    if (artists[i].main_image === "" || artists[i].thumb_image === "") {
      const { images } = await fetchArtist(artists[i].id);
      await sleep(2500);
      artists[i].main_image = images?.[0].uri ?? "";
      artists[i].thumb_image = images?.[0].uri150 ?? "";
    }

    // Update is_performer data
    const roles_str = artist2master
      .filter((v) => v.artist_id === artists[i].id)
      .map((v) => v.roles)
      .join(",");
    const roles = splitRoles(roles_str);
    if (roles.length === 0) {
      throw new Error("failed to get roles of artist " + artists[i].id);
    }
    artists[i].is_performer = hasPerformingRole(roles) ? 1 : 0;
  }

  await writeArtistsToCSV(artists);
};

export const createConnectionDatabase = async () => {
  const masters = await readMastersFromCSV();
  const artist2master = await readArtistToMasterFromCSV();
  let artist2artistMap = new Map<number, ArtistToArtistForm>();

  for (const master of masters) {
    if (master.status !== "ok") {
      continue;
    }
    const master_id = master.master_id;
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
        const pre_data = artist2artistMap.get(key);
        if (pre_data === undefined) {
          artist2artistMap.set(key, {
            id_min: id_min,
            id_max: id_max,
            masters: String(master_id),
          });
        } else {
          const { masters } = pre_data;
          artist2artistMap.set(key, {
            id_min: id_min,
            id_max: id_max,
            masters: masters + "," + master_id,
          });
        }
      }
    }
  }

  await writeArtistToArtistToCSV([...artist2artistMap.values()]);
};
