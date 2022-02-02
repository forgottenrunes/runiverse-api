import { PrismaClient } from "@prisma/client";
import { updateNewOwnerships } from "./generic";
import { SOULS_CONTRACT } from "./souls";

const prisma = new PrismaClient();

updateNewOwnerships(
  prisma.soulOwnershipBlockUpdate,
  parseInt(process.env.SOULS_FIRST_BLOCK as string),
  SOULS_CONTRACT
);
