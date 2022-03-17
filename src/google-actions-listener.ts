import dotenv from "dotenv";
import { conversation } from "@assistant/conversation";
import express from "express";
import bodyParser from "body-parser";
import { WIZARDS_CONTRACT } from "./metadata/wizards";

import { Prisma, PrismaClient } from "@prisma/client";
import markdownToTxt from "./lib/markdown";
import { SOULS_CONTRACT } from "./metadata/souls";
import { PONIES_CONTRACT } from "./metadata/ponies";

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
expressApp.post("/fulfillment", app); // for google actions

async function getTokenFromDb(tokenType: string, wizardId: number) {
  return await prisma.token.findUnique({
    where: {
      tokenContract_tokenId: {
        tokenContract:
          tokenType === "soul"
            ? SOULS_CONTRACT.toLowerCase()
            : tokenType === "pony"
            ? PONIES_CONTRACT.toLowerCase()
            : WIZARDS_CONTRACT.toLowerCase(),
        tokenId: wizardId,
      },
    },
    select: { id: true },
  });
}

async function getTokenNameFromDb(tokenType: string, internalTokenId: string) {
  const queryParams = {
    where: {
      tokenId: internalTokenId,
    },
    select: { name: true },
  };

  const response = await (tokenType === "soul"
    ? prisma.soul.findUnique(queryParams)
    : tokenType === "pony"
    ? prisma.pony.findUnique(queryParams)
    : prisma.wizard.findUnique(queryParams));

  return response?.name ?? "Unknown Character";
}

async function getLoreForToken(internalTokenId: string) {
  const lore = await prisma.lore.findMany({
    where: {
      tokenId: internalTokenId,
    },
    orderBy: { index: "asc" },
  });
  return lore;
}

const TOKEN_NOT_FOUND = "token_not_found";
const NO_LORE = "no_lore";

expressApp.post("/lore-fulfillment", async (req, res) => {
  console.log(`Lore fulfilment request:`);
  console.log(req.body);

  if (!req.body.tokenId || isNaN(parseInt(req.body.tokenId))) {
    return res.json({
      status: TOKEN_NOT_FOUND,
    });
  }

  const tokenId = parseInt(req.body.tokenId);
  const tokenType = req.body.tokenType.toLowerCase();

  const token = await getTokenFromDb(tokenType, tokenId);

  if (!token) {
    return res.json({
      status: TOKEN_NOT_FOUND,
    });
  }

  const lore = await getLoreForToken(token.id);
  const name = await getTokenNameFromDb(tokenType, token.id);

  if (lore.length === 0) {
    return res.json({
      status: NO_LORE,
      name: name,
    });
  }

  return res.json({
    lore: `${markdownToTxt(lore[0].markdownText ?? "Empty lore...")}`,
    name: name,
  });
});

expressApp.post("/recent-lore-fulfillment", async (req, res) => {
  console.log(`Recent lore fulfilment request`);

  const lores: any[] = await prisma.$queryRaw(
    Prisma.sql`select "markdownText" from "PaginatedLore" as l where  "nsfw" = false and length("markdownText") > 50 order by "createdAtBlock" desc limit 1;`
  );

  return res.json({
    lore: `${markdownToTxt(lores[0].markdownText ?? "Empty lore...")}`,
  });
});

// delete once new endpoint above is out
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
