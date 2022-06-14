import { readFile, writeFile } from "fs/promises";

const DELIMITER = "|";

export type MasterForm = {
  master_id: number;
  title: string;
  year: number;
  thumb_image: string;
  cover_image: string;
  release_id: number;
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
    const [
      master_id,
      title,
      year,
      thumb_image,
      cover_image,
      release_id,
      status,
    ] = lines[i].split(DELIMITER);
    masters.push({
      master_id: Number(master_id),
      title,
      year: Number(year),
      thumb_image,
      cover_image,
      release_id: Number(release_id),
      status,
    });
  }
  return masters;
};

export const writeMastersToCSV = async (masters: MasterForm[]) => {
  let data =
    [
      "master_id",
      "title",
      "year",
      "thumb_image",
      "cover_image",
      "release_id",
      "status",
    ].join(DELIMITER) + "\n";
  for (const {
    master_id,
    title,
    year,
    thumb_image,
    cover_image,
    release_id,
    status,
  } of masters) {
    data +=
      [
        master_id,
        title,
        year,
        thumb_image,
        cover_image,
        release_id,
        status,
      ].join(DELIMITER) + "\n";
  }
  await writeFile("./masters.csv", data, { encoding: "utf-8" });
};

export type ArtistForm = {
  id: number;
  name: string;
  thumb_image: string;
  main_image: string;
  is_performer: number;
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
    const [id, name, thumb_image, main_image, is_performer] =
      lines[i].split(DELIMITER);
    artists.push({
      id: Number(id),
      name,
      thumb_image,
      main_image,
      is_performer: Number(is_performer),
    });
  }
  return artists;
};

export const writeArtistsToCSV = async (artists: ArtistForm[]) => {
  let data =
    ["id", "name", "thumb_image", "main_image", "is_performer"].join(
      DELIMITER
    ) + "\n";
  for (const { id, name, thumb_image, main_image, is_performer } of artists) {
    data +=
      [id, name, thumb_image, main_image, is_performer].join(DELIMITER) + "\n";
  }
  await writeFile("./artists.csv", data, { encoding: "utf-8" });
};

export type ArtistToMasterForm = {
  artist_id: number;
  master_id: number;
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
    a2m.push({
      artist_id: Number(artist_id),
      master_id: Number(master_id),
      roles,
    });
  }
  return a2m;
};

export const writeArtistToMasterToCSV = async (
  artistToMaster: ArtistToMasterForm[]
) => {
  let data = ["artist_id", "master_id", "roles"].join(DELIMITER) + "\n";
  for (const { artist_id, master_id, roles } of artistToMaster) {
    data += [artist_id, master_id, roles].join(DELIMITER) + "\n";
  }
  await writeFile("./artistToMaster.csv", data, { encoding: "utf-8" });
};

export type ArtistToArtistForm = {
  id_min: number;
  id_max: number;
  masters: string;
};

export const readArtistToArtistFromCSV = async (): Promise<
  ArtistToArtistForm[]
> => {
  const data = await readFile("./artistToArtist.csv", { encoding: "utf-8" });
  const lines = data.split("\n");
  let a2a: ArtistToArtistForm[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i === 0) {
      continue;
    }
    if (lines[i].trim() === "") {
      continue;
    }
    const [id_min, id_max, masters] = lines[i].split(DELIMITER);
    a2a.push({ id_min: Number(id_min), id_max: Number(id_max), masters });
  }
  return a2a;
};

export const writeArtistToArtistToCSV = async (
  artistToArtist: ArtistToArtistForm[]
) => {
  let data = ["id_min", "id_max", "masters"].join(DELIMITER) + "\n";
  for (const { id_min, id_max, masters } of artistToArtist) {
    data += [id_min, id_max, masters].join(DELIMITER) + "\n";
  }
  await writeFile("./artistToArtist.csv", data, { encoding: "utf-8" });
};
