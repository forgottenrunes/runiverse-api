import dotenv from "dotenv";
dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { IndicesCreateRequest } from "@elastic/elasticsearch/lib/api/types";

let _client: Client;

export function getClient() {
  if (_client === undefined) {
    _client = new Client({
      cloud: {
        id: process.env.ES_CLOUD_ID as string,
      },
      auth: {
        username: process.env.ES_USERNAME as string,
        password: process.env.ES_PASSWORD as string,
      },
    });
  }

  return _client;
}

export const LORE_INDEX: IndicesCreateRequest = {
  index: "lore",
  mappings: {
    properties: {
      id: { type: "text" },
      page: { type: "integer" },
      markdown: { type: "text" },
      previewText: { type: "text" },
      slug: { type: "text" },
      firstImage: { type: "text" },
      tokenName: { type: "text" },
      tokenImage: { type: "text" },
      tokenId: { type: "integer" },
    },
  },
};
