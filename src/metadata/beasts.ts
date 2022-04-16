import { getCurrentBlockNumber } from "../lib/web3";

import { PrismaClient } from "@prisma/client";
import {
  BeastEntry,
  BeastSpawnEntry,
  fetchNewBeasts,
  fetchNewBeastSpawn,
} from "./web3";
import dotenv from "dotenv";
import { find } from "lodash";

const prisma = new PrismaClient();

dotenv.config();

const BLOCK_BATCH_SIZE = 10000;

export const BEASTS_CONTRACT = process.env.BEASTS_CONTRACT as string;

async function updateDbWithMissingBeasts(entries: BeastEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating beast #${entry.tokenId} in db`);

    const metadata = entry.metadata ?? {};
    const attributes = metadata?.attributes ?? [];

    const tokenDict = {
      tokenContract: BEASTS_CONTRACT.toLowerCase(),
      tokenId: entry.tokenId,
    };

    const updateData = {
      name: metadata?.name,
      image: metadata?.image,
      description: metadata?.description,
      background: metadata?.background,
      species: find(attributes, { trait_type: "Species" })?.value,
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: tokenDict,
      },
      select: { id: true },
    });

    if (token) {
      await prisma.beast.upsert({
        where: {
          tokenId: token.id,
        },
        update: { ...updateData, tokenId: token.id },
        create: { ...updateData, tokenId: token.id },
      });
    } else {
      await prisma.beast.create({
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

export async function updateMissingBeasts() {
  console.log(`Updating new beasts...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.beastsBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? parseInt(process.env.BEASTS_FIRST_BLOCK as string);

  console.log(`Current block number is ${currentBlockNumber}`);
  console.log(`Last updated block number was ${previouslyUsedBlockNumber}`);

  const blockBatches =
    Math.floor(
      (currentBlockNumber - previouslyUsedBlockNumber) / BLOCK_BATCH_SIZE
    ) + 1;

  console.log(
    `Will update in ${blockBatches} batches of ${BLOCK_BATCH_SIZE} blocks`
  );

  for (let i = 1; i <= blockBatches; i++) {
    let blockNumber = previouslyUsedBlockNumber + i * BLOCK_BATCH_SIZE;
    const previousBlockNumber =
      previouslyUsedBlockNumber + (i - 1) * BLOCK_BATCH_SIZE;

    if (blockNumber > currentBlockNumber) {
      blockNumber = currentBlockNumber;
    }

    const t0 = performance.now();

    const entries = await fetchNewBeasts(previousBlockNumber, blockNumber);

    // console.log(entries);

    await updateDbWithMissingBeasts(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.beastsBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}

export const BEASTSPAWN_CONTRACT = process.env.BEASTSPAWN_CONTRACT as string;

async function updateDbWithMissingBeastSpawn(entries: BeastSpawnEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating beast spawn #${entry.tokenId} in db`);

    const metadata = entry.metadata ?? {};
    const attributes = metadata?.attributes ?? [];

    const parentBeastToken = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: {
          tokenContract: BEASTS_CONTRACT.toLowerCase(),
          tokenId: entry.parentBeastTokenId,
        },
      },
      select: { id: true },
    });

    if (!parentBeastToken) {
      throw Error("Found spawn without an indexed beast");
    }

    const beast = await prisma.beast.findUnique({
      where: {
        tokenId: parentBeastToken.id,
      },
      select: { id: true },
    });

    if (!beast) {
      throw Error("Found spawn without an indexed beast");
    }

    const updateData = {
      name: metadata?.name,
      image: metadata?.image,
      background: metadata?.background,
      species: find(attributes, { trait_type: "Species" })?.value,
    };

    const tokenDict = {
      tokenContract: BEASTSPAWN_CONTRACT.toLowerCase(),
      tokenId: entry.tokenId,
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: tokenDict,
      },
      select: { id: true },
    });

    if (token) {
      await prisma.beastSpawn.upsert({
        where: {
          tokenId: token.id,
        },
        update: { ...updateData, parentBeastId: beast.id, tokenId: token.id },
        create: { ...updateData, parentBeastId: beast.id, tokenId: token.id },
      });
    } else {
      await prisma.beastSpawn.create({
        data: {
          ...updateData,
          parentBeast: {
            connect: {
              id: beast.id,
            },
          },
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

export async function updateMissingBeastSpawn() {
  console.log(`Updating new Beast Spawn...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.beastSpawnBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
        select: { upToBlockNumber: true },
      })
    )?.upToBlockNumber ??
    parseInt(process.env.BEASTSPAWN_FIRST_BLOCK as string);

  console.log(`Current block number is ${currentBlockNumber}`);
  console.log(`Last updated block number was ${previouslyUsedBlockNumber}`);

  const blockBatches =
    Math.floor(
      (currentBlockNumber - previouslyUsedBlockNumber) / BLOCK_BATCH_SIZE
    ) + 1;

  console.log(
    `Will update in ${blockBatches} batches of ${BLOCK_BATCH_SIZE} blocks`
  );

  for (let i = 1; i <= blockBatches; i++) {
    let blockNumber = previouslyUsedBlockNumber + i * BLOCK_BATCH_SIZE;
    const previousBlockNumber =
      previouslyUsedBlockNumber + (i - 1) * BLOCK_BATCH_SIZE;

    if (blockNumber > currentBlockNumber) {
      blockNumber = currentBlockNumber;
    }

    const t0 = performance.now();

    const entries = await fetchNewBeastSpawn(previousBlockNumber, blockNumber);

    // console.log(entries);

    await updateDbWithMissingBeastSpawn(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.beastSpawnBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
