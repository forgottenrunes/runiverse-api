import dotenv from "dotenv";
import { conversation } from "@assistant/conversation";
import express from "express";
import bodyParser from "body-parser";
import { WIZARDS_CONTRACT } from "./metadata/wizards";

import { PrismaClient } from "@prisma/client";
import markdownToTxt from "./lib/markdown";

dotenv.config();

const prisma = new PrismaClient();

const app = conversation();

app.handle("lore_handler", async (conv) => {
  console.log(conv.intent.params);

  const token = await prisma.token.findUnique({
    where: {
      tokenContract_tokenId: {
        tokenContract: WIZARDS_CONTRACT.toLowerCase(),
        tokenId: parseInt(conv.intent.params?.tokenId?.resolved),
      },
    },
    select: { id: true },
  });

  if (!token) {
    conv.add(
      `Whoopsie, nothing for ${
        conv.intent.params?.tokenId?.resolved ?? "unknown"
      }`
    );
    return;
  }

  const wizard = await prisma.wizard.findUnique({
    where: {
      tokenId: token.id,
    },
    select: { name: true },
  });

  const lore = await prisma.lore.findMany({
    where: {
      tokenId: token.id,
    },
    orderBy: { index: "asc" },
  });

  if (lore.length === 0) {
    conv.add("Found them, but they got no lore");
    return;
  }

  conv.add(`Reading lore for ${wizard?.name}`);
  conv.add(`${markdownToTxt(lore[0].markdownText ?? "")}`);
});

const expressApp = express().use(bodyParser.json());
expressApp.post("/fulfillment", app);

expressApp.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...")
);
