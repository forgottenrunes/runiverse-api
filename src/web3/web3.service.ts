import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Contract, providers } from 'ethers';

import { SOULS_ABI } from './abis/Souls';
import { ERC721_LITE_ABI } from './abis/erc721';
import { PONIES_ABI } from './abis/Ponies';
import { BOOK_OF_LORE_ABI } from './abis/BookOfLore';

type NewOwnerships = {
  [tokenId: number]: string;
};

@Injectable()
export class Web3Service {
  public static async fetchApiMetadata(
    tokenId: number,
    baseUrl: string,
  ): Promise<any> {
    const url = `${baseUrl}/${tokenId}`;

    console.log(`Fetching metadata for ${tokenId} via ${url}`);
    let res;
    try {
      res = await axios.get(url);
    } catch (e: any) {
      console.error('Fetch from network error (after retries)...');
      console.error('Bad IPFS request: ' + e?.message);

      if (e.response.status === 400) {
        // This could happen if say we did have a SoulBurned event but then the owner properly burnt their Soul nft (so no owner)
        console.warn(`Couldn't get metadata for ${tokenId}`);
        return null;
      }
      throw Error('API fetch issue');
    }

    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      console.error('Bad API request: ' + res.statusText);
      throw Error('API issue');
    }
  }

  public static async fetchNewOwnerships(
    sinceBlock: number,
    upToBlockNumber: number,
    contractAddress: string,
  ): Promise<NewOwnerships> {
    const provider = Web3Service.Provider;

    const contract = new Contract(contractAddress, ERC721_LITE_ABI, provider);

    console.log(`Previous block number: ${sinceBlock}`);
    console.log(`Looking up to block number: ${upToBlockNumber}`);

    console.log(`Fetching transfers from ze chain....`);

    const transfers = await contract.queryFilter(
      contract.filters.Transfer(),
      sinceBlock,
      upToBlockNumber,
    );

    const results: NewOwnerships = {};

    for (let i = 0; i < transfers.length; i++) {
      const transferEvent = transfers[i];
      results[transferEvent.args?.tokenId.toNumber()] = transferEvent.args?.to;
    }

    return results;
  }

  // trying out getter approach, not sure if I'll like it

  public static get SoulsContract() {
    const contract = new Contract(
      process.env.SOULS_CONTRACT as string,
      SOULS_ABI,
      Web3Service.Provider,
    );
    return contract;
  }

  public static get PoniesContract() {
    const contract = new Contract(
      process.env.PONIES_CONTRACT as string,
      PONIES_ABI,
      Web3Service.Provider,
    );

    return contract;
  }

  public static get BookOfLoreContract() {
    const contract = new Contract(
      process.env.BOOK_OF_LORE_CONTRACT as string,
      BOOK_OF_LORE_ABI,
      Web3Service.Provider,
    );

    return contract;
  }

  public static get currentBlockNumber() {
    const provider = Web3Service.Provider;
    return provider.getBlockNumber();
  }

  public static get Provider() {
    const provider = new providers.AlchemyProvider(
      parseInt(process.env.CHAIN_ID as string),
    );
    return provider;
  }
}
