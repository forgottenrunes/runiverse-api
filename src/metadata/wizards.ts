import dotenv from "dotenv";
dotenv.config();

import { promises as fs } from "fs";
import path from "path";

import { PrismaClient } from "@prisma/client";
import { find } from "lodash";

const prisma = new PrismaClient();

const WIZARDS_CONTRACT = process.env.WIZARDS_CONTRACT as string;

export async function updateMetadata() {
  const json = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "/data/wizards.json"), "utf8")
  );

  const entries = Object.keys(json);

  for (let i = 0; i < entries.length; i++) {
    const id = entries[i];

    console.log(`Updating wizard #${id}`);

    const metadata = json[id];
    const attributes = metadata?.attributes ?? [];

    const updateData = {
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
            tokenContract: WIZARDS_CONTRACT.toLowerCase(),
            tokenId: parseInt(id),
          },
          where: {
            tokenContract_tokenId: {
              tokenContract: WIZARDS_CONTRACT.toLowerCase(),
              tokenId: parseInt(id),
            },
          },
        },
      },
    };

    const token = await prisma.token.findUnique({
      where: {
        tokenContract_tokenId: {
          tokenContract: WIZARDS_CONTRACT.toLowerCase(),
          tokenId: parseInt(id),
        },
      },
      select: { id: true },
    });

    if (token) {
      await prisma.wizard.upsert({
        where: {
          tokenId: token.id,
        },
        update: updateData,
        create: updateData,
      });
    } else {
      await prisma.wizard.create({ data: updateData });
    }
  }
}
