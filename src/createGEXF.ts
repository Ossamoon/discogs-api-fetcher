import { writeFile } from "fs/promises";
import Graph from "graphology";
import * as gexf from "graphology-gexf";
import { hasPerformingRole, splitRoles } from "./check";
import {
  readArtistsFromCSV,
  readArtistToMasterFromCSV,
  readMastersFromCSV,
} from "./filemanage";

export const createGEXFfromCSV = async () => {
  const graph: Graph<{ label: string }, { weight: number }> = new Graph({
    type: "undirected",
    multi: false,
    allowSelfLoops: false,
  });

  console.log("Reading masters...");
  const masters = await readMastersFromCSV();

  console.log("Reading artists...");
  const artists = await readArtistsFromCSV();

  console.log("Reading artistsToMasters...");
  const artist2master = await readArtistToMasterFromCSV();

  ("Creating Graph...");
  masters
    .map((master) => master.id)
    .forEach((master_id) => {
      // Get artists joined to the master
      const joinedArtists = artist2master
        .filter((v) => v.master_id === master_id)
        .filter((v) => hasPerformingRole(splitRoles(v.roles)))
        .map((v) => v.artist_id)
        .map((v) => artists.find((w) => w.id === v))
        .filter((v) => v !== undefined);

      // Create nodes
      joinedArtists.forEach((v) => {
        if (!v) return;
        if (graph.hasNode(v.id)) return;
        graph.addNode(v.id, { label: v.name });
      });

      // Create edges
      for (let i = 0; i < joinedArtists.length; i++) {
        for (let j = i + 1; j < joinedArtists.length; j++) {
          const [key, edgeWasAdded, sourceWasAdded, targetWasAdded] =
            graph.updateEdge(
              joinedArtists[i]?.id,
              joinedArtists[j]?.id,
              // anyを使ってしまっているので要注意
              (attr: any) => {
                return {
                  ...attr,
                  weight: (attr.weight || 0) + 1,
                };
              }
            );
          if (sourceWasAdded || targetWasAdded) {
            throw new Error("Error on creating edge");
          }
        }
      }
    });

  // Write GEXF file
  const gexfString = gexf.write(graph, {
    formatNode: (_, attr) => {
      return {
        label: attr.label,
      };
    },
    formatEdge: (_, attr) => {
      return {
        weight: attr.weight,
      };
    },
  });
  await writeFile("./out.gexf", gexfString, { encoding: "utf-8" });
};
