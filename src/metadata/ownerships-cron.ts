import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { WIZARDS_CONTRACT } from "./wizards";
import { updateNewOwnerships } from "./generic";
import { PONIES_CONTRACT } from "./ponies";
import { SOULS_CONTRACT } from "./souls";

async function updateOwnerships() {
  console.log("Wizards....");
  await updateNewOwnerships(
    prisma.wizardOwnershipBlockUpdate,
    parseInt(process.env.WIZARDS_FIRST_BLOCK as string),
    WIZARDS_CONTRACT
  );

  console.log("Souls....");
  await updateNewOwnerships(
    prisma.soulOwnershipBlockUpdate,
    parseInt(process.env.SOULS_FIRST_BLOCK as string),
    SOULS_CONTRACT
  );

  console.log("Ponies....");
  await updateNewOwnerships(
    prisma.ponyOwnershipBlockUpdate,
    parseInt(process.env.PONIES_FIRST_BLOCK as string),
    PONIES_CONTRACT
  );
}

updateOwnerships();
