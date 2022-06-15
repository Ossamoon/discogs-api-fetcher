import {
  createArtistDatabase,
  createMasterDatabase,
  createConnectionDatabase,
  updateMasterDatabese,
  updateArtistDatabase,
} from "./createCSV";
import { createGEXFfromCSV, createJSONfromCSV } from "./exportFile";

const main = async () => {
  // await createMasterDatabase();
  // await updateMasterDatabese();
  // await createArtistDatabase();
  // await updateArtistDatabase();
  // await createConnectionDatabase();
  // await createGEXFfromCSV();
  // await createJSONfromCSV();
  console.log("Finish");
};

main();
