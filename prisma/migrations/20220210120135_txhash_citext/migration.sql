-- AlterTable

drop view if exists "PaginatedLore";

ALTER TABLE "Lore" ALTER COLUMN "txHash" SET DATA TYPE CITEXT;

create or replace view "PaginatedLore" as
SELECT l."id",
       l."createdAt",
       l."updatedAt",
       l."rawContent",
       l."backgroundColor",
       l."markdownText",
       l."previewText",
       l."index",
       l.creator,
       l."parentLoreIndex",
       l."loreMetadataURI",
       l."txHash",
       l."createdAtBlock",
       l.nsfw,
       l.struck,
       l."discordNotified",
       l."twitterNotified",
       row_number()
       OVER (PARTITION BY lt."tokenContract", lt."tokenId" ORDER BY "createdAtBlock" asc)
                                                                                   as page,
       row_number() over (order by lc."order", lt."tokenId", "createdAtBlock" asc) as globalPage,
       lt."tokenId",
       lt."tokenContract",
       lc."slug",
       li."href" as "firstImage"
FROM "Lore" as l
         join "Token" as lt on l."tokenId" = LT.id
         join "LoreContract" as lc on lt."tokenContract" = lc."tokenContract"
left join "LoreImage" as li on li."id" = ((
    SELECT _li."id"
    FROM "LoreImage" as _li
    WHERE _li."loreId" = l.id
    order by _li."updatedAt" asc
    LIMIT 1
));
