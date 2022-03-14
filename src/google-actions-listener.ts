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

  if (!conv.intent.params?.tokenId?.resolved) {
    conv.add("Sorry, I didn't quite understand. Please try again.");
    conv.add(
      "Which wizard would you like to hear lore for? Say something like: read lore for wizard 6464"
    );
    return;
  }

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
      }. Which wizard would you like to hear lore for? Say something like: read lore for wizard 6464`
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
    conv.add(
      "Found them, but they got no lore. Which wizard would you like to hear lore for? Say something like: read lore for wizard 6464. "
    );
    return;
  }

  conv.add(`Reading lore for ${wizard?.name}`);
  conv.add(`${markdownToTxt(lore[0].markdownText ?? "")}`);
  conv.scene.next = { name: "actions.scene.END_CONVERSATION" };
});

const expressApp = express().use(bodyParser.json());
expressApp.post("/fulfillment", app);
expressApp.post("/alexa-fulfillment", async (req, res) => {
  console.log(req.body);
  if (!req.body.wizardId || isNaN(parseInt(req.body.wizardId))) {
    return res.json({
      lore: "Whoops, couldn't quite understand this wizard id... goodbye",
    });
  }
  const token = await prisma.token.findUnique({
    where: {
      tokenContract_tokenId: {
        tokenContract: WIZARDS_CONTRACT.toLowerCase(),
        tokenId: parseInt(req.body.wizardId),
      },
    },
    select: { id: true },
  });

  if (!token) {
    return res.json({
      lore: "Whoops, no lore found for this wizard id... goodbye",
    });
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
    return res.json({
      lore: "Found wizard, but they have no lore. Goodbye!",
    });
  }

  return res.json({ lore: `${markdownToTxt(lore[0].markdownText ?? "")}` });
});

expressApp.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...")
);
