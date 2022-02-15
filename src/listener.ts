import { getBookOfLoreContract } from "./lore/web3";
import { getProvider } from "./lib/web3";
import { updateMissingLore } from "./lore/db";

import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";

const q: queueAsPromised<any> = fastq.promise(worker, 1);

async function worker(log: any) {
  console.log(`Working on lore up to current block`);
  console.log(log);
  await updateMissingLore();
}

async function processLoreEvents() {
  const provider = getProvider();
  const contract = getBookOfLoreContract();

  provider.on("block", async (blockNumber) => {
    console.log(`Listener is at block ${blockNumber}`);
  });

  provider.on(contract.filters.LoreAdded(), async (log: any, event: any) => {
    console.log("New lore added, how exciting...");
    q.push(log).catch((err) => console.error(err));
  });

  provider.on(contract.filters.LoreUpdated(), async (log: any, event: any) => {
    console.log("Some lore was updated, how exciting...");
    q.push(log).catch((err) => console.error(err));
  });

  provider.on(contract.filters.LoreStruck(), async (log: any, event: any) => {
    console.log("Some lore was struck :/");
    q.push(log).catch((err) => console.error(err));
  });
}

processLoreEvents();
