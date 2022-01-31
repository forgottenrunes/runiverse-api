import dotenv from "dotenv";
dotenv.config();

import { Client, Intents, MessageEmbed, TextChannel } from "discord.js";
import prismaImport from "@prisma/client";
import { truncate } from "../lore/ipfs";

const { PrismaClient, Prisma } = prismaImport;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

const IPFS_SERVER =
  process.env.NEXT_PUBLIC_IPFS_SERVER ??
  "https://res.cloudinary.com/dopby768d/image/fetch/f_auto/https://nfts.forgottenrunes.com/ipfs";

function getImage(story: string, tokenId: string) {
  // console.log(story);
  // We use first image for og metadata, and yes regex not the coolest method but it works :)
  let firstImage = story?.match(/!\[(?:.*?)\]\((ipfs.*?)\)/im)?.[1];

  if (firstImage) {
    return firstImage.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
  }

  return `https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${tokenId}.png`;
}

function getOgImage(
  tokenId: string,
  story: string,
  title: string,
  bg?: string
) {
  const image = getImage(story, tokenId);

  const params: { [key: string]: any } = { images: image };

  if (bg) {
    params.bgColor = bg;
  }

  const queryString = Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
  return [
    `https://og.forgottenrunes.com/`,
    encodeURI(title).replace(/\./g, "%2E"),
    ".png",
    "?",
    queryString,
  ].join("");
}

// When the client is ready, run this code (only once)
client.once("ready", async () => {
  console.log("Checking if any lore needs sending to Discord!");

  const prisma = new PrismaClient();
  const lores: any[] = await prisma.$queryRaw(
    Prisma.sql`SELECT l.id, lt.token_contract as "tokenContract", lt.token_id as "tokenId", row_number()
    OVER (PARTITION BY LT.token_contract, LT.token_id ORDER BY created_at_block asc)
    as page, l.preview_text as "previewText", l.raw_content as "rawContent"
FROM lore as l
         join token as lt on l.lore_token_id = LT.id
where l.discord_notified = false
  and l.nsfw = false
order by l.created_at_block desc
limit 10;`
  );

  const channel = (await client.channels.fetch(
    process.env.CHANNEL_ID as string
  )) as TextChannel;

  if (!channel) {
    console.error(`Channel not found ${process.env.CHANNEL_ID}`);
  }

  for (let i = 0; i < lores.length; i++) {
    const lore = lores[i];

    const image = getOgImage(
      lore.tokenId,
      lore?.rawContent?.description,
      lore.previewText
        ? truncate(lore.previewText, 120)
        : `The Lore of Wizard #${lore.tokenId}`,
      lore?.rawContent?.background_color ?? "#000000"
    );

    // console.log(image);
    const url = `https://www.forgottenrunes.com/lore/wizards/${lore.tokenId}/${
      lore.page - 1
    }`;
    const exampleEmbed = new MessageEmbed()
      .setTitle("New Lore Added")
      .setURL(url)
      .setAuthor(`Wizard #${lore.tokenId}`)
      .setImage(image)
      .setDescription(
        lore?.previewSentence ?? `The Lore of Wizard #${lore.tokenId}`
      );

    await prisma.lore.update({
      where: { id: lore.id },
      data: { discordNotified: true },
    });

    if (lore?.previewSentence && lore?.rawContent?.description) {
      await channel
        .send({ embeds: [exampleEmbed] })
        .then((message) => console.log(`Sent message: ${lore.id}`))
        .catch(console.error);
    } else {
      console.log(`Ignoring empty lore with id ${lore.id}`);
    }
  }
  console.log("Done");
  await client.destroy();
});

// Login to Discord with your client's token
client.login(process.env.DICORD_TOKEN);
