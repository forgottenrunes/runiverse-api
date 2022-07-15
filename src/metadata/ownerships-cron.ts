import { PrismaClient } from "@prisma/client";
import { WIZARDS_CONTRACT } from "./wizards";
import { updateNewOwnerships } from "./generic";
import { PONIES_CONTRACT } from "./ponies";
import { SOULS_CONTRACT } from "./souls";
import { BEASTS_CONTRACT, BEASTSPAWN_CONTRACT } from "./beasts";
import { WARRIORS_CONTRACT } from "./warriors";
import { BABY_WIZARDS_CONTRACT } from "./baby-wizards";

const prisma = new PrismaClient();

async function updateOwnerships() {
  if (WIZARDS_CONTRACT) {
    console.log("Updating Wizards....");
    await updateNewOwnerships(
      prisma.wizardOwnershipBlockUpdate,
      parseInt(process.env.WIZARDS_FIRST_BLOCK as string),
      WIZARDS_CONTRACT
    );
  } else {
    console.warn("Not updating Wizards as contract not set in env vars.");
  }

  if (SOULS_CONTRACT) {
    console.log("Updating Souls....");
    await updateNewOwnerships(
      prisma.soulOwnershipBlockUpdate,
      parseInt(process.env.SOULS_FIRST_BLOCK as string),
      SOULS_CONTRACT
    );
  } else {
    console.warn("Not updating Souls as contract not set in env vars.");
  }

  if (PONIES_CONTRACT) {
    console.log("Ponies....");
    await updateNewOwnerships(
      prisma.ponyOwnershipBlockUpdate,
      parseInt(process.env.PONIES_FIRST_BLOCK as string),
      PONIES_CONTRACT
    );
  } else {
    console.warn("Not updating Ponies as contract not set in env vars.");
  }

  if (BEASTS_CONTRACT) {
    console.log("Beasts....");
    await updateNewOwnerships(
      prisma.beastOwnershipBlockUpdate,
      parseInt(process.env.BEASTS_FIRST_BLOCK as string),
      BEASTS_CONTRACT
    );
  } else {
    console.warn("Not updating Beasts as contract not set in env vars.");
  }

  if (BEASTSPAWN_CONTRACT) {
    console.log("Beast spawn....");
    await updateNewOwnerships(
      prisma.beastSpawnOwnershipBlockUpdate,
      parseInt(process.env.BEASTSPAWN_FIRST_BLOCK as string),
      BEASTSPAWN_CONTRACT
    );
  } else {
    console.warn("Not updating Beast spawn as contract not set in env vars.");
  }

  if (WARRIORS_CONTRACT) {
    console.log("Updating Warriors....");
    await updateNewOwnerships(
      prisma.warriorOwnershipBlockUpdate,
      parseInt(process.env.WARRIORS_FIRST_BLOCK as string),
      WARRIORS_CONTRACT
    );
  } else {
    console.warn("Not updating Warriors as contract not set in env vars.");
  }

  if (BABY_WIZARDS_CONTRACT) {
    console.log("Updating Baby wizards....");
    await updateNewOwnerships(
      prisma.babyWizardOwnershipBlockUpdate,
      parseInt(process.env.BABY_WIZARDS_FIRST_BLOCK as string),
      BABY_WIZARDS_CONTRACT
    );
  } else {
    console.warn("Not updating Baby wizards as contract not set in env vars.");
  }
}

updateOwnerships();
