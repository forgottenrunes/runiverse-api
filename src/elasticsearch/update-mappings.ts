import { IndicesCreateRequest } from "@elastic/elasticsearch/lib/api/types";
import { getClient, LORE_INDEX } from "./client";

export async function updateIndexMapping(esIndex: IndicesCreateRequest) {
  const es = getClient();
  const indexExists = await es.indices.exists({
    index: esIndex.index,
  });

  if (indexExists) {
    // await es.indices.delete({
    //   index: esIndex.index,
    // });
    // console.log(`Deleted index ${esIndex.index}`);
    console.log(`Updating mappings for index "${esIndex.index}"`);
    await es.indices.putMapping({
      index: esIndex.index,
      body: esIndex.mappings,
    });
  } else {
    console.log(`Creating mappings for index "${esIndex.index}"`);
    await es.indices.create(esIndex);
  }

  const response = await es.count({ index: esIndex.index });

  console.log(response);
}

export async function updateMappings() {
  await updateIndexMapping(LORE_INDEX);
}

updateMappings();
