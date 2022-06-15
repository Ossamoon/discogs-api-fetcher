import { writeFile } from "fs/promises";
import Graph from "graphology";
import * as gexf from "graphology-gexf";
import { readArtistsFromCSV, readArtistToArtistFromCSV } from "./manageCSV";

export const createJSONfromCSV = async () => {
  const graph: Graph<{ label: string }, { weight: number }> = new Graph({
    type: "undirected",
    multi: false,
    allowSelfLoops: false,
  });

  const artists = await readArtistsFromCSV();
  const artist2artist = await readArtistToArtistFromCSV();

  // Create nodes
  artists
    .filter((v) => v.is_performer === 1)
    .forEach((v) => {
      graph.addNode(v.id, { label: v.name });
    });

  // Create edges
  artist2artist.forEach((v) => {
    graph.addEdge(v.id_min, v.id_max, { weight: v.masters.split(",").length });
  });

  // Write GEXF file
  const graphjson = graph.export();
  await writeFile("./out.json", JSON.stringify(graphjson), {
    encoding: "utf-8",
  });
};

export const createGEXFfromCSV = async () => {
  const graph: Graph<{ label: string }, { weight: number }> = new Graph({
    type: "undirected",
    multi: false,
    allowSelfLoops: false,
  });

  const artists = await readArtistsFromCSV();
  const artist2artist = await readArtistToArtistFromCSV();

  // Create nodes
  artists
    .filter((v) => v.is_performer === 1)
    .forEach((v) => {
      graph.addNode(v.id, { label: v.name });
    });

  // Create edges
  artist2artist.forEach((v) => {
    graph.addEdge(v.id_min, v.id_max, { weight: v.masters.split(",").length });
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
