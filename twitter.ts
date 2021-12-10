import dotenv from "dotenv";
import { Client, Intents, MessageEmbed, TextChannel } from "discord.js";
import prismaImport from "@prisma/client";
import { truncate } from "./lib.js";
import Twitter from "twitter-v2";
import Twit from "twit";

dotenv.config();

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

// const client = new Twitter({
//   consumer_key: '1447681692181860352-o4M4rHTnpRUD509ZH92HLZc5Ji9AjJ',
//   consumer_secret: 'HdwAtEOWb5IB7kxcA9tAEPnMOjj0l61v9izNN9sPdxrin',
//   bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFt5UgEAAAAAKLFxkgAe3jadDlAkTbeKNxej954%3DHdoXvKirCSg2FeP3fog0r4Ng5MdYhOb0KdEI8bH5K2QHPmzsIx',
// });

// await client.post("statuses/update", {status: "Hello"})

var T = new Twit({
  access_token: "1447681692181860352-CmvGT1rmV9p9v6vndc3JNse1JLCKEU",
  access_token_secret: "R8x6WBI9LH94R1FdEjPvw2PT1CfRxJDSlcdDWL7UQPz7a",
  consumer_key: "KkwC6bO3vS5Y1QxMMlObmoqrA",
  consumer_secret: "e8kZ6rfDTaSmEHx4lK1XVZWI4XAqggTC9u4o3dkCZuQf4uGS8H",
  // app_only_auth:        true,
  // bearer_token: 'AAAAAAAAAAAAAAAAAAAAAFt5UgEAAAAAKLFxkgAe3jadDlAkTbeKNxej954%3DHdoXvKirCSg2FeP3fog0r4Ng5MdYhOb0KdEI8bH5K2QHPmzsIx',
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: false, // optional - requires SSL certificates to be valid.
});

//
//  tweet 'hello world!'
//
T.post(
  "statuses/update",
  { status: "hello world!" },
  function (err, data, response) {
    console.log(data);
    console.log(err);
  }
);

// const prisma = new PrismaClient();
// const lores: any[] = await prisma.$queryRaw(
//     Prisma.sql`SELECT l.id, lt."tokenContract", lt."tokenId", row_number() OVER (PARTITION BY LT."tokenContract", LT."tokenId" ORDER BY "createdAtBlock" asc) as page, l.content
// FROM "Lore" as l join "LoreToken" as lt on l."loreTokenId" = LT.id where l."twitterNotified" = false order by l."createdAtBlock" desc limit 10;`
// );
//
//
// for (let i = 0; i < lores.length; i++) {
//   const lore = lores[i];
//
//   const image = getOgImage(
//       lore.tokenId,
//       lore?.content?.description,
//       lore.content?.previewSentence
//           ? truncate(lore.content.previewSentence, 120)
//           : lore?.content?.name ?? `The Lore of Wizard #${lore.tokenId}`,
//       lore?.content?.background_color ?? "#000000"
//   );
//
//   // console.log(image);
//   const url = `https://www.forgottenrunes.com/lore/wizards/${lore.tokenId}/${
//       lore.page - 1
//   }`;
//   const exampleEmbed = new MessageEmbed()
//       .setTitle("New Lore Added")
//       .setURL(url)
//       .setAuthor(`Wizard #${lore.tokenId}`)
//       .setImage(image)
//       .setDescription(lore.content.previewSentence);
//
//   await prisma.lore.update({
//     where: { id: lore.id },
//     data: { discordNotified: true },
//   });
//
//   await channel
//       .send({ embeds: [exampleEmbed] })
//       .then((message) => console.log(`Sent message: ${lore.id}`))
//       .catch(console.error);
// }
console.log("Done");
