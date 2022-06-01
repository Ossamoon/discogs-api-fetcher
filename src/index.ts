import { fetchMaster, fetchRelease } from "./fetch";

const main = async () => {
  const master_id = 530487;
  const master = await fetchMaster(master_id);

  console.log("id: ", master.id);
  console.log("title: ", master.title);
  console.log("main_release: ", master.main_release);

  const release_id = master.main_release;
  const release = await fetchRelease(release_id);

  console.log("artists: ", release.artists);
  console.log("extraartists: ", release.extraartists);
};

main();
