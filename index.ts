import prismaImport from "@prisma/client";
import { Contract, providers } from "ethers";
import BookOfLore from "./abis/BookOfLore.json";
import fetch from "node-fetch";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

import remarkSqueezeParagraphs from "remark-squeeze-paragraphs";
import { unified } from "unified";
import { VFileCompatible } from "unified/lib";
import { performance } from "perf_hooks";
import { truncate } from "./lib.js";

const { PrismaClient } = prismaImport;

const { abi } = BookOfLore;

const prisma = new PrismaClient();

const IPFS_SERVER = "https://nfts.forgottenrunes.com/ipfs";

async function fetchLoreMetadata(loreMetadataURI: string | null): Promise<any> {
  if (!loreMetadataURI) return {};

  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  // console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL === "undefined") {
    return {};
  }

  //TODO: retries?
  return await fetch(ipfsURL).then(async (res) => {
    if (res.ok) {
      const json: any = await res.json();
      // console.log(json?.description);
      const tree = unified()
        .use(remarkParse)
        .use(remarkSqueezeParagraphs)
        // @ts-ignore
        .parse(<VFileCompatible>json?.description);

      const texts: string[] = [];
      visit(tree, (node: any) => {
        // console.log(node.type);
        if (
          node.type === "text" ||
          node.type === "strong" ||
          node.type === "italic"
        ) {
          const text = node.value?.replace(/\n/gi, " ");
          if (
            text &&
            text.length > 0 &&
            !text.startsWith("The Lore of") &&
            !text.startsWith("Delete this text")
          )
            texts.push(text);
          // console.log(node);
        }
      });

      json.previewSentence = truncate(texts.join(". "));

      return json;
    } else {
      console.error("Bad IPFS request: " + res.statusText);
      throw Error("IPFS issue");
    }
  });
}

async function main() {
  console.log(`Updating new lore...`);
  const t0 = performance.now();

  const provider = new providers.AlchemyProvider();

  const contract = new Contract(
    "0x4218948D1Da133CF4B0758639a8C065Dbdccb2BB",
    abi,
    provider
  );

  const loreAddedFilter = contract.filters.LoreAdded();

  const currentBlockNumber = await provider.getBlockNumber();

  const previouslyUsedBlockNumber: number =
    (
      await prisma.loreUpdates.findFirst({
        orderBy: {
          upToBlockNumber: "desc",
        },
      })
    )?.upToBlockNumber ?? 13237324;

  console.log(`Previous block number: ${previouslyUsedBlockNumber}`);
  console.log(`Current block number: ${currentBlockNumber}`);

  console.log(`Fetching lores from ze chain....`);

  const lores = await contract.queryFilter(
    loreAddedFilter,
    previouslyUsedBlockNumber,
    currentBlockNumber
  );

  console.log(`Got ${lores.length} lores`);
  console.log(`Updating lore in db....`);

  await Promise.all(
    lores.map(async (loreData) => {
      const tokenContract = loreData.args?.tokenContract;
      const tokenId = loreData.args?.tokenId.toNumber();
      const loreIndex = loreData.args?.loreIdx.toNumber();
      const txHash = loreData.transactionHash;

      const loreContractData = (
        await contract.loreAt(tokenContract, tokenId, loreIndex, loreIndex)
      )[0];

      const updateData = {
        loreMetadataURI: loreContractData.loreMetadataURI,
        creator: loreContractData.creator,
        nsfw: loreContractData.nsfw,
        parentLoreIndex: loreContractData.parentLoreId.toNumber(),
        struck: loreContractData.struck,
        loreToken: {
          connectOrCreate: {
            create: {
              tokenContract: tokenContract,
              tokenId: tokenId,
            },
            where: {
              tokenContract_tokenId: {
                tokenContract: tokenContract,
                tokenId: tokenId,
              },
            },
          },
        },
        index: loreIndex,
        txHash: txHash,
        content: await fetchLoreMetadata(loreContractData.loreMetadataURI),
        createdAtBlock: loreData.blockNumber,
      };

      await prisma.lore.upsert({
        where: { txHash: updateData.txHash },
        update: updateData,
        create: updateData,
      });

      // console.log(parsedData);
      return updateData;
    })
  );

  const timeTaken = Math.round(performance.now() - t0);

  console.log(`Time taken: ${timeTaken}`);

  await prisma.loreUpdates.upsert({
    where: { upToBlockNumber: currentBlockNumber },
    update: { upToBlockNumber: currentBlockNumber, timeTaken: timeTaken },
    create: { upToBlockNumber: currentBlockNumber, timeTaken: timeTaken },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
