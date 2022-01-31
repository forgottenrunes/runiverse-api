import dotenv from "dotenv";
dotenv.config();

import { providers } from "ethers";

export async function getCurrentBlockNumber() {
  return await getProvider().getBlockNumber();
}

export function getProvider() {
  const provider = new providers.AlchemyProvider(
    parseInt(process.env.CHAIN_ID as string)
  );
  return provider;
}
