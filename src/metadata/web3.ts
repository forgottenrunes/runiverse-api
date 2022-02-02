import dotenv from "dotenv";
import { Contract } from "ethers";
import { getProvider } from "../lib/web3";
import { SOULS_ABI } from "../abis/Souls";
import axios from "axios";
import axiosRetry from "axios-retry";
import { ERC721_LITE_ABI } from "../abis/erc721";

dotenv.config();

axiosRetry(axios, { retries: 3 });

export type SoulEntry = {
  tokenId: number;
  transmutedFromTokenContract: string;
  transmutedFromTokenId: number;
  burnIndex: number;
  metadata: any;
};

export async function fetchSoulMetadata(
  tokenId: number
): Promise<SoulEntry[] | null> {
  const url = `${process.env.SOULS_BASE_URL}/${tokenId}`;

  console.log(`Fetching soul metadata for ${tokenId} via ${url}`);
  let res;
  try {
    res = await axios.get(url);
  } catch (e: any) {
    console.error("Fetch from network error (after retries)...");
    console.error("Bad IPFS request: " + e?.message);

    if (e.response.status === 400) {
      // This could happen if say we did have a SoulBurned event but then the owner properly burnt their Soul nft (so no owner)
      console.warn(`Couldn't get metadata for ${tokenId}`);
      return null;
    }
    throw Error("API fetch issue");
  }

  if (res.status >= 200 && res.status < 300) {
    return res.data;
  } else {
    console.error("Bad API request: " + res.statusText);
    throw Error("API issue");
  }
}

export async function fetchNewSouls(
  sinceBlock: number,
  upToBlockNumber: number
): Promise<SoulEntry[]> {
  const provider = getProvider();

  const contract = new Contract(
    process.env.SOULS_CONTRACT as string,
    SOULS_ABI,
    provider
  );

  console.log(`Previous block number: ${sinceBlock}`);
  console.log(`Looking up to block number: ${upToBlockNumber}`);
  console.log(`Fetching new souls from ze chain....`);

  const soulEvents = await contract.queryFilter(
    contract.filters.SoulBurned(),
    sinceBlock,
    upToBlockNumber
  );

  console.log(`Got ${soulEvents.length} new soul events`);

  const entries: SoulEntry[] = [];

  for (let i = 0; i < soulEvents.length; i++) {
    const soulEvent: any = soulEvents[i];

    const soulId = soulEvent.args.soulId.toNumber();

    const metadata = await fetchSoulMetadata(soulId);

    if (!metadata) continue;

    const soulEntry: SoulEntry = {
      transmutedFromTokenContract: soulEvent.args.tokenContract,
      transmutedFromTokenId: soulEvent.args.tokenId.toNumber(),
      tokenId: soulId,
      burnIndex: soulEvent.args.burnIdx.toNumber(),
      metadata: metadata,
    };

    entries.push(soulEntry);
  }

  console.log("Souls fetched successfully....");

  return entries;
}

type NewOwnerships = {
  [tokenId: number]: string;
};

export async function fetchNewOwnerships(
  sinceBlock: number,
  upToBlockNumber: number,
  contractAddress: string
): Promise<NewOwnerships> {
  const provider = getProvider();

  const contract = new Contract(contractAddress, ERC721_LITE_ABI, provider);

  console.log(`Previous block number: ${sinceBlock}`);
  console.log(`Looking up to block number: ${upToBlockNumber}`);

  console.log(`Fetching transfers from ze chain....`);

  const transfers = await contract.queryFilter(
    contract.filters.Transfer(),
    sinceBlock,
    upToBlockNumber
  );

  const results: NewOwnerships = {};

  for (let i = 0; i < transfers.length; i++) {
    const transferEvent = transfers[i];
    results[transferEvent.args?.tokenId.toNumber()] = transferEvent.args?.to;
  }

  return results;
}
