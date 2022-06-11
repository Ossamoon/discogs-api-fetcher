import { searchMaster } from "./fetch";
import { MasterForm } from "./filemanage";
import { writeMastersToCSV } from "./filemanage";

const QUERY = "";
const GENRE = "Jazz";
const STYLE = "Bop";

const main = async () => {
  // Search by genre and style
  let page: number = 1;
  let masters: MasterForm[] = [];

  while (page < 3) {
    const { results, pagination } = await searchMaster(
      page,
      QUERY,
      GENRE,
      STYLE
    );
    console.log(`Page ${page}/${pagination.pages}`);

    results.forEach((master) => {
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
    if (page === pagination.pages) {
      break;
    } else {
      page++;
    }
  }

  await writeMastersToCSV(masters);
};

main();
