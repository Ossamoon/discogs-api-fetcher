import {
  createArtistDatabase,
  createMasterDatabase,
  createConnectionDatabase,
} from "./createCSV";
import { createGEXFfromCSV } from "./createGEXF";

const main = async () => {
  await createConnectionDatabase();
};

main();
