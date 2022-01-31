import dotenv from "dotenv";
dotenv.config();

import zipWith from "lodash/zipWith";
import { Contract } from "ethers";
import { BOOK_OF_LORE_ABI } from "../abis/BookOfLore";

import {
  Contract as MultiCallContract,
  Provider as MultiCallProvider,
} from "ethcall";
import { getProvider } from "../lib/web3";

export type LoreEntry = {
  tokenContract: string;
  tokenId: number;
  loreIndex: number;
  txHash: string;
  createdAtBlock: number;
  creator: string;
  parentLoreId: number;
  nsfw: boolean;
  struck: boolean;
  loreMetadataURI: string;
};

export async function fetchLoreChanges(
  sinceBlock: number,
  upToBlockNumber: number
): Promise<{ entries: LoreEntry[] }> {
  const provider = getProvider();

  const contract = new Contract(
    process.env.BOOK_OF_LORE_CONTRACT as string,
    BOOK_OF_LORE_ABI,
    provider
  );

  console.log(`Previous block number: ${sinceBlock}`);
  console.log(`Looking up to block number: ${upToBlockNumber}`);

  console.log(`Fetching lores from ze chain....`);

  const [added, updated, struck] = await Promise.all([
    contract.queryFilter(
      contract.filters.LoreAdded(),
      sinceBlock,
      upToBlockNumber
    ),
    contract.queryFilter(
      contract.filters.LoreUpdated(),
      sinceBlock,
      upToBlockNumber
    ),
    contract.queryFilter(
      contract.filters.LoreStruck(),
      sinceBlock,
      upToBlockNumber
    ),
  ]);

  const lores = [...added, ...updated, ...struck];

  console.log(`Got ${lores.length} lores`);

  const multiCallProvider = new MultiCallProvider();
  await multiCallProvider.init(provider);

  const multiCallBoLContract = new MultiCallContract(
    process.env.BOOK_OF_LORE_CONTRACT as string,
    BOOK_OF_LORE_ABI
  );

  const loreChanges = lores.map((loreData) => ({
    tokenContract: loreData.args?.tokenContract,
    tokenId: loreData.args?.tokenId.toNumber(),
    loreIndex: loreData.args?.loreIdx.toNumber(),
    txHash: loreData.transactionHash,
    createdAtBlock: loreData.blockNumber,
  }));

  console.log("Doing multicall to get extra lore data from contract...");

  const chainData = await multiCallProvider.all(
    loreChanges.map((loreChange) => {
      return multiCallBoLContract.loreAt(
        loreChange.tokenContract,
        loreChange.tokenId,
        loreChange.loreIndex,
        loreChange.loreIndex
      );
    })
  );

  const combinedData: LoreEntry[] = zipWith(
    loreChanges,
    chainData,
    (loreChange, loreChainData: any) => ({
      ...loreChange,
      creator: loreChainData[0].creator,
      parentLoreId: loreChainData[0].parentLoreId.toNumber(),
      nsfw: loreChainData[0].nsfw,
      struck: loreChainData[0].struck,
      loreMetadataURI: loreChainData[0].loreMetadataURI,
    })
  );

  console.log("Lore fetched successfully....");

  return { entries: combinedData };
}
