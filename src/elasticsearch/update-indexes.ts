import { Prisma, PrismaClient } from "@prisma/client";
import { getClient } from "./client";

const prisma = new PrismaClient();

export async function updateLoreIndex() {
  const es = getClient();

  const lores: any[] = await prisma.$queryRaw(
    Prisma.sql`select S.name as "soul.name", S.image as "soul.image",
       W.name as "wizard.name", W.image as "wizard.image",
       B.name as "beast.name", B.image as "beast.image",
       BS.name as "spawn.name", BS.image as "spawn.image",
       P.name as "pony.name", P.image as "pony.image",
       WAR.name as "warrior.name", WAR.image as "warrior.image",
       l."tokenId" as "tokenId",
       l.id, slug, page, "markdownText", "firstImage"
        from "PaginatedLore" as l join "Token" T on l."internalTokenId" = T."id"
           left join "Soul" S on T.id = S."tokenId"
           left join "Wizard" W on T.id = W."tokenId"
           left join "Beast" B on T.id = B."tokenId"
           left join "BeastSpawn" BS on T.id = BS."tokenId"
           left join "Pony" P on T.id =  P."tokenId"
           left join "Warrior" WAR on T.id = WAR."tokenId"
        where  "nsfw" = false and "struck" = false and "markdownText" is not null;`
  );

  const body = lores.flatMap((entry) => [
    { index: { _index: "lore", _id: entry.id } },
    {
      slug: entry.slug,
      page: entry.page,
      markdown: entry.markdownText,
      firstImage: entry.firstImage,
      tokenId: entry.tokenId,
      tokenName:
        entry["wizard.name"] ??
        entry["beast.name"] ??
        entry["spawn.name"] ??
        entry["pony.name"] ??
        entry["soul.name"] ??
        entry["warrior.name"],
      tokenImage:
        entry["wizard.image"] ??
        entry["beast.image"] ??
        entry["spawn.image"] ??
        entry["pony.image"] ??
        entry["soul.image"] ??
        entry["warrior.image"],
    },
  ]);

  const prevCount = await es.count({ index: "lore" });

  await es.bulk({ refresh: true, body });

  const count = await es.count({ index: "lore" });

  console.log(`Added ${count.count - prevCount.count} new lores\nDone!\n`);

  // (
  //   await es.search({
  //     query: { simple_query_string: { query: "pony" } },
  //   })
  // ).hits.hits.map((result) => console.log(result));
}

updateLoreIndex();
