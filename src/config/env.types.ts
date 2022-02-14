export interface IEnvironmentVariables {
  DATABASE_URL: string;

  CHAIN_ID: number;
  BOOK_OF_LORE_CONTRACT: string;
  BOOK_OF_LORE_FIRST_BLOCK: number;

  WIZARDS_CONTRACT: string;
  WIZARDS_FIRST_BLOCK: number;

  SOULS_CONTRACT: string;
  SOULS_FIRST_BLOCK: number;
  SOULS_BASE_URL: string;

  PONIES_CONTRACT: string;
  PONIES_FIRST_BLOCK: number;
  PONIES_BASE_URL: string;
  IPFS_SERVER: string;

  DISCORD_TOKEN: string;
  CHANNEL_ID: string;
}
