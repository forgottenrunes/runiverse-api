import dotenv from 'dotenv';

import { Client, Intents, MessageEmbed, TextChannel } from 'discord.js';
import { truncate } from '../lore/ipfs';

import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

const IPFS_SERVER =
  process.env.IPFS_SERVER ??
  'https://res.cloudinary.com/dopby768d/image/fetch/f_auto/https://nfts.forgottenrunes.com/ipfs';

const CHARACTER_SETTINGS: {
  [slug: string]: { singularName: string; imageBaseUrl: string };
} = {
  wizards: {
    singularName: 'Wizard',
    imageBaseUrl: process.env.WIZARDS_BASE_IMAGE_URL as string,
  },
  souls: {
    singularName: 'Soul',
    imageBaseUrl: process.env.SOULS_BASE_IMAGE_URL as string,
  },
  ponies: {
    singularName: 'Pony',
    imageBaseUrl: process.env.PONIES_BASE_IMAGE_URL as string,
  },
};

function getImage(tokenId: string, tokenSlug: string, firstImage?: string) {
  // console.log(story);
  // We use first image for og metadata, and yes regex not the coolest method but it works :)
  if (firstImage) {
    return firstImage.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
  }

  return (
    CHARACTER_SETTINGS[tokenSlug.toLowerCase()].imageBaseUrl + `${tokenId}.png`
  );
}

function getOgImage(
  tokenId: string,
  tokenSlug: string,
  title: string,
  story: string,
  bg?: string,
  firstImage?: string,
) {
  const params: { [key: string]: any } = {};

  if (bg) {
    params['bgColor'] = bg.replace('#', '');
  }

  params['images'] = getImage(tokenId, tokenSlug, firstImage);

  const queryString = Object.keys(params)
    .map((key) => key + '=' + encodeURIComponent(params[key]))
    .join('&');

  return `https://og.forgottenrunes.com/${encodeURI(story).replace(
    /\./g,
    '%2E',
  )}.png?${queryString}`;
}

// When the client is ready, run this code (only once)
client.once('ready', async () => {
  console.log('Checking if any lore needs sending to Discord!');

  const channel = (await client.channels.fetch(
    process.env.CHANNEL_ID as string,
  )) as TextChannel;

  if (!channel) {
    console.error(`Channel not found ${process.env.CHANNEL_ID}`);
  }

  const lores: any[] = await prisma.$queryRaw(
    Prisma.sql`select * from "PaginatedLore" as l
where  "discordNotified" = false and "nsfw" = false order by "createdAtBlock" asc
limit 10;`,
  );

  console.log(`Got ${lores.length} new lore entries`);

  for (let i = 0; i < lores.length; i++) {
    const lore = lores[i];

    console.log(`Notifying about lore ${lore.id} ${lore.slug} ${lore.tokenId}`);

    const character = CHARACTER_SETTINGS[lore.slug.toLowerCase()].singularName;

    const characterName = `The Lore of ${character} ${lore.tokenId}`;

    const image = getOgImage(
      lore.tokenId,
      lore.slug,
      characterName,
      lore?.previewText ? truncate(lore.previewText, 120) : characterName,
      lore?.rawContent?.background_color ?? '#000000',
      lore.firstImage,
    );

    console.log(image);

    // console.log(image);
    const url = `https://www.forgottenrunes.com/lore/${lore.slug}/${
      lore.tokenId
    }/${lore.page - 1}`;
    const exampleEmbed = new MessageEmbed()
      .setTitle('New Lore Added')
      .setURL(url)
      .setAuthor(`${character} #${lore.tokenId}`)
      .setImage(image)
      .setDescription(lore?.previewText ?? characterName);

    await prisma.lore.update({
      where: { id: lore.id },
      data: { discordNotified: true },
    });

    if (lore?.previewText || lore?.firstImage) {
      await channel
        .send({ embeds: [exampleEmbed] })
        .then((message) => console.log(`Sent message: ${lore.id}`))
        .catch(console.error);
    } else {
      console.log(`Ignoring empty lore with id ${lore.id}`);
    }
  }
  console.log('Done');
  await client.destroy();
});

// Login to Discord with your client's token
client.login(process.env.DICORD_TOKEN);
