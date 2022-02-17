export const BOOK_OF_LORE_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
    ],
    name: 'LoreAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
    ],
    name: 'LoreStruck',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
    ],
    name: 'LoreUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'parentLoreId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'nsfw',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'loreMetadataURI',
        type: 'string',
      },
    ],
    name: 'addLore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'parentLoreId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'nsfw',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'loreMetadataURI',
        type: 'string',
      },
    ],
    name: 'addLoreWithScribe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loreId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'parentLoreId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'nsfw',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'loreMetadataURI',
        type: 'string',
      },
    ],
    name: 'addLoreWithSignature',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'domainSeparator',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'startIdx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endIdx',
        type: 'uint256',
      },
    ],
    name: 'loreAt',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'parentLoreId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'nsfw',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'struck',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'loreMetadataURI',
            type: 'string',
          },
        ],
        internalType: 'struct BookOfLore.Lore[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'loreFor',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'parentLoreId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'nsfw',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'struck',
            type: 'bool',
          },
          {
            internalType: 'string',
            name: 'loreMetadataURI',
            type: 'string',
          },
        ],
        internalType: 'struct BookOfLore.Lore[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'loreTokenContractAllowlist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'numLore',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'scribeAllowlist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isListed',
        type: 'bool',
      },
    ],
    name: 'setLoreTokenAllowlist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'scribeAddress',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isScribe',
        type: 'bool',
      },
    ],
    name: 'setScribeAllowlist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'newStruck',
        type: 'bool',
      },
    ],
    name: 'strikeLore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokenLore',
    outputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'parentLoreId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'nsfw',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'struck',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'loreMetadataURI',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'newLoreMetadataURI',
        type: 'string',
      },
    ],
    name: 'updateLoreMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loreIdx',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'newNSFW',
        type: 'bool',
      },
    ],
    name: 'updateLoreNSFW',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
