import dotenv from "dotenv";
dotenv.config();

import { fetchLoreChanges, getCurrentBlockNumber, LoreEntry } from "./web3";

import { PrismaClient } from "@prisma/client";
import { fetchAndDehydrateLore } from "./ipfs";

const prisma = new PrismaClient();

const BLOCK_BATCH_SIZE = 10000;

export async function updateDbWithLoreEntries(entries: LoreEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(
      `Updating new entry sequence #${i} for ${entry.tokenContract}-${entry.tokenId}-${entry.loreIndex}`
    );

    if (!entry.loreMetadataURI) {
      console.log("Skipping update as metadata is not defined");
      continue;
    }

    const { markdownText, previewText, images, rawContent } =
      await fetchAndDehydrateLore(entry.loreMetadataURI);

    const updateData = {
      loreMetadataURI: entry.loreMetadataURI,
      creator: entry.creator,
      nsfw: entry.nsfw,
      parentLoreIndex: entry.parentLoreId,
      struck: entry.struck,
      loreToken: {
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

    const updatedLore = await prisma.lore.upsert({
      where: { txHash: updateData.txHash },
      update: updateData,
      create: updateData,
      select: { id: true },
    });

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
  }
}

export async function updateMissingLore() {
  console.log(`Updating new lore...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.loreUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ??
    parseInt(process.env.BOOK_OF_LORE_FIRST_BLOCK as string);

  console.log(`Last updated block number was ${previouslyUsedBlockNumber}`);

  const blockBatches =
    Math.floor(
      (currentBlockNumber - previouslyUsedBlockNumber) / BLOCK_BATCH_SIZE
    ) + 1;

  console.log(
    `Will update lore in ${blockBatches} batches of ${BLOCK_BATCH_SIZE} blocks`
  );

  for (let i = 1; i <= blockBatches; i++) {
    const blockNumber = previouslyUsedBlockNumber + i * BLOCK_BATCH_SIZE;
    const previousBlockNumber =
      previouslyUsedBlockNumber + (i - 1) * BLOCK_BATCH_SIZE;

    const t0 = performance.now();

    const { entries, upToBlockNumber } = await fetchLoreChanges(
      previousBlockNumber,
      blockNumber
    );

    await updateDbWithLoreEntries(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(
      `Updated up to block ${upToBlockNumber}. Time taken ${timeTaken}`
    );

    await prisma.loreUpdate.upsert({
      where: { upToBlockNumber: upToBlockNumber },
      update: { upToBlockNumber: upToBlockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: upToBlockNumber, timeTaken: timeTaken },
    });
  }
}
