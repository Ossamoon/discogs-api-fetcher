import { createArtistDatabase, createMasterDatabase } from "./createCSV";
import { createGEXFfromCSV } from "./createGEXF";

const main = async () => {
  await createGEXFfromCSV();
};

main();
