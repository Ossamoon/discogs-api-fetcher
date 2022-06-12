import { getRoles } from "./check";
import { searchMaster, getArtistsDataFromMasterId } from "./fetch";
import {
  ArtistForm,
  ArtistToMasterForm,
  MasterForm,
  writeArtistToMasterFromCSV,
} from "./filemanage";
import {
  readMastersFromCSV,
  writeMastersToCSV,
  writeArtistsToCSV,
} from "./filemanage";
import { sleep } from "./lib";

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
  // Get master data from CSV file.
  let masters: MasterForm[] = await readMastersFromCSV();
  let artistMap = new Map<number, ArtistForm>();
  let artist2master: ArtistToMasterForm[] = [];

  for (let i = 0; i < masters.length; i++) {
    const master_id = Number(masters[i].id);
    console.log(`${i + 1}/${masters.length} id=${master_id}`);
    await sleep(5500);
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

      artist2master.push({
        artist_id: String(artist.id),
        master_id: String(master_id),
        roles: getRoles(artist),
      });
    });
  }

  await writeMastersToCSV(masters);
  await writeArtistsToCSV([...artistMap.values()]);
  await writeArtistToMasterFromCSV(artist2master);
};
