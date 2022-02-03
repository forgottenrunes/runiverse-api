import { getCurrentBlockNumber } from "../lib/web3";

import { PrismaClient } from "@prisma/client";
import { fetchNewPonies, PonyEntry } from "./web3";
import dotenv from "dotenv";
import { find } from "lodash";
import { Decimal } from "@prisma/client/runtime";

const prisma = new PrismaClient();

dotenv.config();

const BLOCK_BATCH_SIZE = 10000;

export const PONIES_CONTRACT = process.env.PONIES_CONTRACT as string;

async function updateDbWithMissingPonies(entries: PonyEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating pony #${entry.tokenId} in db`);

    const metadata = entry.metadata ?? {};
    const attributes = metadata?.attributes ?? [];

    const tokenDict = {
      tokenContract: PONIES_CONTRACT.toLowerCase(),
      tokenId: entry.tokenId,
    };

    const updateData = {
      name: metadata?.name,
      image: metadata?.image,
      genes: entry.genes,
      background: find(attributes, { trait_type: "background" })?.value,
      pony: find(attributes, { trait_type: "pony" })?.value,
      head: find(attributes, { trait_type: "head" })?.value,
      clothes: find(attributes, { trait_type: "clothes" })?.value,
      mouth: find(attributes, { trait_type: "mouth" })?.value,
      rune: find(attributes, { trait_type: "rune" })?.value,
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: tokenDict,
      },
      select: { id: true },
    });

    if (token) {
      await prisma.pony.upsert({
        where: {
          tokenId: token.id,
        },
        update: { ...updateData, tokenId: token.id },
        create: { ...updateData, tokenId: token.id },
      });
    } else {
      await prisma.pony.create({
        data: {
          ...updateData,
          token: {
            connectOrCreate: {
              create: tokenDict,
              where: {
                tokenContract_tokenId: tokenDict,
              },
            },
          },
        },
      });
    }
  }
}

export async function updateMissingPonies() {
  console.log(`Updating new ponies...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.poniesBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? parseInt(process.env.PONIES_FIRST_BLOCK as string);

  console.log(`Current block number is ${currentBlockNumber}`);
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

    const entries = await fetchNewPonies(previousBlockNumber, blockNumber);

    // console.log(entries);

    await updateDbWithMissingPonies(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.poniesBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
