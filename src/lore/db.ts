import dotenv from "dotenv";
dotenv.config();

import { fetchLoreChanges, LoreEntry } from "./web3";

import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { fetchAndDehydrateLore } from "./ipfs";
import { getCurrentBlockNumber } from "../lib/web3";
import axios from "axios";

const BLOCK_BATCH_SIZE = 10000;

export async function updateDbWithLoreEntries(
  entries: LoreEntry[]
): Promise<number> {
  let countUpdated = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(
      `Updating new entry sequence #${i} for ${entry.tokenContract}-${entry.tokenId}-${entry.loreIndex}`
    );

    const { markdownText, previewText, images, rawContent } =
      await fetchAndDehydrateLore(entry.loreMetadataURI);

    const updateData = {
      loreMetadataURI: entry.loreMetadataURI,
      creator: entry.creator,
      nsfw: entry.nsfw,
      parentLoreIndex: entry.parentLoreId,
      struck: entry.struck,
      backgroundColor: rawContent?.background_color,
      token: {
        connectOrCreate: {
          create: {
            tokenContract: entry.tokenContract.toLowerCase(),
            tokenId: entry.tokenId,
          },
          where: {
            tokenContract_tokenId: {
              tokenContract: entry.tokenContract.toLowerCase(),
              tokenId: entry.tokenId,
            },
          },
        },
      },
      index: entry.loreIndex,
      txHash: entry.txHash,
      markdownText,
      previewText,
      rawContent,
      createdAtBlock: entry.createdAtBlock,
    };

    const existingLore = await prisma.lore.findFirst({
      where: {
        index: entry.loreIndex,
        token: {
          tokenContract: entry.tokenContract.toLowerCase(),
          tokenId: entry.tokenId,
        },
      },
    });

    let updatedLore: any;

    if (existingLore) {
      updatedLore = await prisma.lore.update({
        where: { id: existingLore.id },
        data: updateData,
        select: { id: true },
      });
      console.log("Deleting previous images to avoid double adding...");
      await prisma.loreImage.deleteMany({ where: { loreId: existingLore.id } });
    } else {
      updatedLore = await prisma.lore.create({
        data: updateData,
        select: { id: true },
      });
    }

    console.log(`Updating ${images.length} images`);

    for (let j = 0; j < images.length; j++) {
      const imageHref = images[j];
      if (imageHref.startsWith("data")) continue; // ignore data blobs
      await prisma.loreImage.upsert({
        where: { loreId_href: { loreId: updatedLore.id, href: imageHref } },
        update: { loreId: updatedLore.id, href: imageHref },
        create: { loreId: updatedLore.id, href: imageHref },
      });
    }

    countUpdated += 1;
  }

  return countUpdated;
}

export async function rebuildLoreWebPages(fromBlock: number, toBlock: number) {
  if (!process.env.LORE_REVALIDATION_URL) {
    console.warn(
      "Not requesting website page rebuilds for new lore as env var not set."
    );
  }

  const lores: any[] = await prisma.$queryRaw(
    Prisma.sql`select * from "PaginatedLore" as l where  "createdAtBlock" >= ${fromBlock} and"createdAtBlock" <= ${toBlock}`
  );

  for (let i = 0; i < lores.length; i++) {
    const lore = lores[i];

    const revalidateUrl = `${process.env.LORE_REVALIDATION_URL}&tokenSlug=${lore.slug}&tokenId=${lore.tokenId}&page=${lore.page}`;

    let res;
    try {
      console.log(`Revalidating ${revalidateUrl}`);
      res = await axios.get(revalidateUrl);
    } catch (e: any) {
      console.error(`Will skip ${revalidateUrl} due to an error`);
    }
  }
}

export async function updateMissingLore() {
  console.log(`Updating new lore...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.loreBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ??
    parseInt(process.env.BOOK_OF_LORE_FIRST_BLOCK as string);

  console.log(`Current log number is ${currentBlockNumber}`);
  console.log(`Last updated block number was ${previouslyUsedBlockNumber}`);

  const blockBatches =
    Math.floor(
      (currentBlockNumber - previouslyUsedBlockNumber) / BLOCK_BATCH_SIZE
    ) + 1;

  console.log(
    `Will update lore in ${blockBatches} batches of ${BLOCK_BATCH_SIZE} blocks`
  );

  for (let i = 1; i <= blockBatches; i++) {
    let blockNumber = previouslyUsedBlockNumber + i * BLOCK_BATCH_SIZE;
    const previousBlockNumber =
      previouslyUsedBlockNumber + (i - 1) * BLOCK_BATCH_SIZE;

    if (blockNumber > currentBlockNumber) {
      blockNumber = currentBlockNumber;
    }

    const t0 = performance.now();

    const { entries } = await fetchLoreChanges(
      previousBlockNumber,
      blockNumber
    );

    const countUpdated = await updateDbWithLoreEntries(entries);

    if (countUpdated > 0) {
      if (countUpdated <= 10) {
        console.log("Forcing NextJS rebuild of updated lore pages...");
        await rebuildLoreWebPages(previousBlockNumber, blockNumber);
      } else {
        console.log(
          "We updated more than 10 lores in one go so not rebuilding NextJS pages. Consider kicking off a build once all caught up."
        );
      }
    }

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.loreBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
