import dotenv from "dotenv";
dotenv.config();

import { getCurrentBlockNumber } from "../lib/web3";

import { PrismaClient } from "@prisma/client";
import { fetchNewWarriors, WarriorEntry } from "./web3";

import { find } from "lodash";

const prisma = new PrismaClient();

const BLOCK_BATCH_SIZE = 10000;

export const WARRIORS_CONTRACT = process.env.WARRIORS_CONTRACT as string;

async function updateDbWithMissingWarriors(entries: WarriorEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating warrior #${entry.tokenId} in db`);

    const metadata = entry.metadata ?? {};
    const attributes = metadata?.attributes ?? [];

    const tokenDict = {
      tokenContract: WARRIORS_CONTRACT.toLowerCase(),
      tokenId: entry.tokenId,
    };

    const updateData = {
      name: metadata?.name,
      image: metadata?.image,
      backgroundColor: metadata?.backgroundColor,
      background: find(attributes, { trait_type: "background" })?.value,
      body: find(attributes, { trait_type: "body" })?.value,
      head: find(attributes, { trait_type: "head" })?.value,
      weapon: find(attributes, { trait_type: "weapon" })?.value,
      companion: find(attributes, { trait_type: "companion" })?.value,
      rune: find(attributes, { trait_type: "rune" })?.value,
      shield: find(attributes, { trait_type: "shield" })?.value,
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: tokenDict,
      },
      select: { id: true },
    });

    if (token) {
      await prisma.warrior.upsert({
        where: {
          tokenId: token.id,
        },
        update: { ...updateData, tokenId: token.id },
        create: { ...updateData, tokenId: token.id },
      });
    } else {
      await prisma.warrior.create({
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

export async function updateMissingWarriors() {
  console.log(`Updating new warriors...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.warriorBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? parseInt(process.env.WARRIORS_FIRST_BLOCK as string);

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

    const entries = await fetchNewWarriors(previousBlockNumber, blockNumber);

    await updateDbWithMissingWarriors(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.warriorBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
