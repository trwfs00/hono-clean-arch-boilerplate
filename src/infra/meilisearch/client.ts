import { MeiliSearch } from "meilisearch";

export const meili = new MeiliSearch({
  host: process.env.MEILI_URL || "http://127.0.0.1:7700",
  apiKey: process.env.MEILI_MASTER_KEY,
});
