import {
  createArtistDatabase,
  createMasterDatabase,
  createConnectionDatabase,
  updateMasterDatabese,
  updateArtistDatabase,
} from "./createCSV";
import { createGEXFfromCSV } from "./createGEXF";

const main = async () => {
  // await createMasterDatabase();
  // await updateMasterDatabese();
  // await createArtistDatabase();
  // await updateArtistDatabase();
  // await createConnectionDatabase();
  await createGEXFfromCSV();
  console.log("Finish");
};

main();
