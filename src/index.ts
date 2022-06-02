import { fetchMaster, fetchRelease } from "./fetch";
import { getPerformingRoles } from "./check";

const main = async () => {
  const master_id = 530487;
  const master = await fetchMaster(master_id);

  console.log("id: ", master.id);
  console.log("title: ", master.title);
  console.log("main_release: ", master.main_release);

  const release_id = master.main_release;
  const release = await fetchRelease(release_id);

  console.log("Artists:");
  for (const artist of release.artists) {
    const performingRoles = getPerformingRoles(artist);
    if (performingRoles === undefined) {
      console.error(`\t${artist.name}: ${undefined}`);
      continue;
    }
    if (performingRoles.length === 0) {
      console.log(`\t${artist.name}: Non Performer`);
      continue;
    }
    console.log(`\t${artist.name}: ${performingRoles}`);
  }

  console.log("ExtraArtists:");
  for (const artist of release.extraartists) {
    const performingRoles = getPerformingRoles(artist);
    if (performingRoles === undefined) {
      console.error(`\t${artist.name}: ${undefined}`);
      continue;
    }
    if (performingRoles.length === 0) {
      console.log(`\t${artist.name}: Non Performer`);
      continue;
    }
    console.log(`\t${artist.name}: ${performingRoles}`);
  }
};

main();
