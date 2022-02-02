import { getCurrentBlockNumber } from "../lib/web3";

import { PrismaClient } from "@prisma/client";
import { fetchNewSouls, SoulEntry } from "./web3";
import dotenv from "dotenv";
import { find } from "lodash";
import { WIZARDS_CONTRACT } from "./wizards";

const prisma = new PrismaClient();

dotenv.config();

const BLOCK_BATCH_SIZE = 10000;

export const SOULS_CONTRACT = process.env.SOULS_CONTRACT as string;

async function updateDbWithMissingSouls(entries: SoulEntry[]) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    console.log(`Updating soul #${entry.tokenId}`);

    const metadata = entry.metadata;
    const attributes = metadata?.attributes ?? [];

    const updateData = {
      burnIndex: entry.burnIndex,
      name: metadata?.name,
      image: metadata?.image,
      backgroundColor: metadata?.background_color,
      background: find(attributes, { trait_type: "background" })?.value,
      body: find(attributes, { trait_type: "body" })?.value,
      head: find(attributes, { trait_type: "head" })?.value,
      familiar: find(attributes, { trait_type: "familiar" })?.value,
      prop: find(attributes, { trait_type: "prop" })?.value,
      rune: find(attributes, { trait_type: "rune" })?.value,
      token: {
        connectOrCreate: {
          create: {
            tokenContract: SOULS_CONTRACT.toLowerCase(),
            tokenId: entry.tokenId,
          },
          where: {
            tokenContract_tokenId: {
              tokenContract: SOULS_CONTRACT.toLowerCase(),
              tokenId: entry.tokenId,
            },
          },
        },
      },
      transmutedFromToken: {
        connectOrCreate: {
          create: {
            tokenContract: entry.transmutedFromTokenContract,
            tokenId: entry.transmutedFromTokenId,
          },
          where: {
            tokenContract_tokenId: {
              tokenContract: entry.transmutedFromTokenContract,
              tokenId: entry.transmutedFromTokenId,
            },
          },
        },
      },
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: {
          tokenContract: SOULS_CONTRACT.toLowerCase(),
          tokenId: entry.tokenId,
        },
      },
      select: { id: true },
    });

    let tokenId;

    if (token) {
      await prisma.soul.upsert({
        where: {
          tokenId: token.id,
        },
        update: updateData,
        create: updateData,
      });
      tokenId = token.id;
    } else {
      const updatedSoul = await prisma.soul.create({
        data: updateData,
        select: { tokenId: true },
      });
      tokenId = updatedSoul.tokenId;
    }

    // Update wizard as burnt
    if (
      entry.transmutedFromTokenContract.toLowerCase() ===
      WIZARDS_CONTRACT.toLowerCase()
    ) {
      console.log(`Updating wizard ${tokenId} as burnt`);

      const tokenSearchParams = {
        tokenContract: entry.transmutedFromTokenContract.toLowerCase(),
        tokenId: entry.transmutedFromTokenId,
      };

      const wizardToken = await prisma.token.findUnique({
        where: {
          tokenContract_tokenId: tokenSearchParams,
        },
        select: { id: true, wizard: true },
      });

      if (wizardToken && wizardToken.wizard) {
        await prisma.wizard.update({
          where: {
            tokenId: wizardToken.id,
          },
          data: { isBurnt: true },
        });
      } else {
        await prisma.wizard.create({
          data: {
            isBurnt: true,
            token: {
              connectOrCreate: {
                create: tokenSearchParams,
                where: {
                  tokenContract_tokenId: tokenSearchParams,
                },
              },
            },
          },
        });
      }
    }
  }
}

export async function updateMissingSouls() {
  console.log(`Updating new souls...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.soulsBlockUpdate.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? parseInt(process.env.SOULS_FIRST_BLOCK as string);

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

    const entries = await fetchNewSouls(previousBlockNumber, blockNumber);

    await updateDbWithMissingSouls(entries);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await prisma.soulsBlockUpdate.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
