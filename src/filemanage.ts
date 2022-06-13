import { readFile, writeFile } from "fs/promises";

const DELIMITER = "|";

export type MasterForm = {
  id: string;
  title: string;
  year: string;
  url: string;
  thumb_image: string;
  cover_image: string;
  status: string;
};

export const readMastersFromCSV = async (): Promise<MasterForm[]> => {
  const data = await readFile("./masters.csv", { encoding: "utf-8" });
  const lines = data.split("\n");
  let masters: MasterForm[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      continue;
    }
    if (lines[i].trim() === "") {
      continue;
    }
    const [id, title, year, url, thumb_image, cover_image, status] =
      lines[i].split(DELIMITER);
    masters.push({ id, title, year, url, thumb_image, cover_image, status });
  }
  return masters;
};

export const writeMastersToCSV = async (masters: MasterForm[]) => {
  let data =
    ["id", "title", "year", "url", "thumb_image", "cover_image", "status"].join(
      DELIMITER
    ) + "\n";
  for (const {
    id,
    title,
    year,
    url,
    thumb_image,
    cover_image,
    status,
  } of masters) {
    data +=
      [id, title, year, url, thumb_image, cover_image, status].join(DELIMITER) +
      "\n";
  }
  await writeFile("./masters.csv", data, { encoding: "utf-8" });
};

export type ArtistForm = {
  id: string;
  name: string;
  url: string;
};

export const readArtistsFromCSV = async (): Promise<ArtistForm[]> => {
  const data = await readFile("./artists.csv", { encoding: "utf-8" });
  const lines = data.split("\n");
  let artists: ArtistForm[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      continue;
    }
    if (lines[i].trim() === "") {
      continue;
    }
    const [id, name, url] = lines[i].split(DELIMITER);
    artists.push({ id, name, url });
  }
  return artists;
};

export const writeArtistsToCSV = async (artists: ArtistForm[]) => {
  let data = ["id", "name", "url"].join(DELIMITER) + "\n";
  for (const { id, name, url } of artists) {
    data += [id, name, url].join(DELIMITER) + "\n";
  }
  await writeFile("./artists.csv", data, { encoding: "utf-8" });
};

export type ArtistToMasterForm = {
  artist_id: string;
  master_id: string;
  roles: string;
};

export const readArtistToMasterFromCSV = async (): Promise<
  ArtistToMasterForm[]
> => {
  const data = await readFile("./artistToMaster.csv", { encoding: "utf-8" });
  const lines = data.split("\n");
  let a2m: ArtistToMasterForm[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      continue;
    }
    if (lines[i].trim() === "") {
      continue;
    }
    const [artist_id, master_id, roles] = lines[i].split(DELIMITER);
    a2m.push({ artist_id, master_id, roles });
  }
  return a2m;
};

export const writeArtistToMasterFromCSV = async (
  artistToMaster: ArtistToMasterForm[]
) => {
  let data = ["artist_id", "master_id", "roles"].join(DELIMITER) + "\n";
  for (const { artist_id, master_id, roles } of artistToMaster) {
    data += [artist_id, master_id, roles].join(DELIMITER) + "\n";
  }
  await writeFile("./artistToMaster.csv", data, { encoding: "utf-8" });
};
