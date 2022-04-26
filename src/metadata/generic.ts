import { Prisma, PrismaClient } from "@prisma/client";
import { getCurrentBlockNumber } from "../lib/web3";
import { fetchNewOwnerships } from "./web3";

const prisma = new PrismaClient();
const BLOCK_BATCH_SIZE = 2000;

export async function updateNewOwnerships(
  blockUpdateDbModel:
    | Prisma.WizardOwnershipBlockUpdateDelegate<any>
    | Prisma.SoulOwnershipBlockUpdateDelegate<any>
    | Prisma.PonyOwnershipBlockUpdateDelegate<any>
    | Prisma.BeastOwnershipBlockUpdateDelegate<any>
    | Prisma.BeastSpawnOwnershipBlockUpdateDelegate<any>
    | Prisma.WarriorOwnershipBlockUpdateDelegate<any>,
  defaultFirstBlockNumber: number,
  contractAddress: string
) {
  console.log(`Updating ownerships...`);

  const currentBlockNumber = await getCurrentBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await blockUpdateDbModel.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? defaultFirstBlockNumber;

  console.log(`Current block number is ${currentBlockNumber}`);
  console.log(`Last updated block number was ${previouslyUsedBlockNumber}`);

  const blockBatches =
    Math.floor(
      (currentBlockNumber - previouslyUsedBlockNumber) / BLOCK_BATCH_SIZE
    ) + 1;

  console.log(
    `Will update ownerships in ${blockBatches} batches of ${BLOCK_BATCH_SIZE} blocks`
  );

  for (let i = 1; i <= blockBatches; i++) {
    let blockNumber = previouslyUsedBlockNumber + i * BLOCK_BATCH_SIZE;
    const previousBlockNumber =
      previouslyUsedBlockNumber + (i - 1) * BLOCK_BATCH_SIZE;

    if (blockNumber > currentBlockNumber) {
      blockNumber = currentBlockNumber;
    }

    const t0 = performance.now();

    const newOwnerships = await fetchNewOwnerships(
      previousBlockNumber,
      blockNumber,
      contractAddress
    );

    const tokenIdsWithNewOwners = Object.keys(newOwnerships);

    console.log(
      `Updating ${tokenIdsWithNewOwners.length} new token owners in db...`
    );

    for (let i = 0; i < tokenIdsWithNewOwners.length; i++) {
      const tokenId = parseInt(tokenIdsWithNewOwners[i]);
      const newOwner = newOwnerships[tokenId];

      console.log(
        `Updating ${contractAddress}-${tokenId} to owner ${newOwner}`
      );

      await prisma.token.upsert({
        where: {
          tokenContract_tokenId: {
            tokenContract: contractAddress,
            tokenId: tokenId,
          },
        },
        update: { currentOwner: newOwner },
        create: {
          currentOwner: newOwner,
          tokenContract: contractAddress,
          tokenId: tokenId,
        },
      });
    }

    // console.log(fetchNewOwnerships);

    const timeTaken = Math.round(performance.now() - t0);

    console.log(`Updated up to block ${blockNumber}. Time taken ${timeTaken}`);

    await blockUpdateDbModel.upsert({
      where: { upToBlockNumber: blockNumber },
      update: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
      create: { upToBlockNumber: blockNumber, timeTaken: timeTaken },
    });
  }
}
