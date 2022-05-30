import dotenv from "dotenv";
dotenv.config();

import { getCurrentBlockNumber } from "../lib/web3";

import { PrismaClient } from "@prisma/client";
import { fetchNewBabyWizards, BabyWizardEntry } from "./web3";

import { find } from "lodash";

const prisma = new PrismaClient();

const BLOCK_BATCH_SIZE = 10000;

export const BABY_WIZARDS_CONTRACT = process.env
  .BABY_WIZARDS_CONTRACT as string;

async function updateDbWithMissingBabyWizards(entries: BabyWizardEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating baby_wizard #${entry.tokenId} in db`);

    const metadata = entry.metadata ?? {};
    const attributes = metadata?.attributes ?? [];

    const tokenDict = {
      tokenContract: BABY_WIZARDS_CONTRACT.toLowerCase(),
      tokenId: entry.tokenId,
    };

    const updateData = {
      name: metadata?.name,
      image: metadata?.image,
      backgroundColor: metadata?.backgroundColor,
      background: find(attributes, { trait_type: "background" })?.value,
      body: find(attributes, { trait_type: "body" })?.value,
      head: find(attributes, { trait_type: "head" })?.value,
      familiar: find(attributes, { trait_type: "familiar" })?.value,
      prop: find(attributes, { trait_type: "prop" })?.value,
      rune: find(attributes, { trait_type: "rune" })?.value,
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: tokenDict,
      },
      select: { id: true },
    });

    if (token) {
      await prisma.babyWizard.upsert({
        where: {
          tokenId: token.id,
        },
        update: { ...updateData, tokenId: token.id },
        create: { ...updateData, tokenId: token.id },
      });
    } else {
      await prisma.babyWizard.create({
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

export async function updateMissingBabyWizards() {
  console.log(`Updating new baby wizards...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.babyWizardBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ??
    parseInt(process.env.BABY_WIZARDS_FIRST_BLOCK as string);

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

    const entries = await fetchNewBabyWizards(previousBlockNumber, blockNumber);

    await updateDbWithMissingBabyWizards(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.babyWizardBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
