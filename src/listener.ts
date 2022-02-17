import { getBookOfLoreContract } from './lore/web3';
import { getProvider } from './lib/web3';
import { updateMissingLore } from './lore/db';

async function processLoreEvents() {
  const provider = getProvider();
  const contract = getBookOfLoreContract();

  provider.on('block', (blockNumber) => {
    console.log(`At block ${blockNumber}`);
  });

  provider.on(contract.filters.LoreAdded(), async (log, event) => {
    console.log('New lore added, how exciting...');
    console.log(log);
    await updateMissingLore();
  });

  provider.on(contract.filters.LoreUpdated(), async (log, event) => {
    console.log('Some lore was updated, how exciting...');
    console.log(log);
    await updateMissingLore();
  });

  provider.on(contract.filters.LoreStruck(), async (log, event) => {
    console.log('Some lore was struck :/');
    console.log(log);
    await updateMissingLore();
  });
}

processLoreEvents();
