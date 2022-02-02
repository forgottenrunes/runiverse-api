import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { WIZARDS_CONTRACT } from "./wizards";
import { updateNewOwnerships } from "./generic";

updateNewOwnerships(
  prisma.wizardOwnershipBlockUpdate,
  parseInt(process.env.WIZARDS_FIRST_BLOCK as string),
  WIZARDS_CONTRACT
);
