# Runiverse Data Loader

This repo contains scripts that populate a Postgres database with various data from the runiverse. Right now the following is supported:

- Fully expanded metadata for all tokens (Wizards, Souls and Ponies)
- Fully expanded lore
- Lore images links
- Ownership of each token

### How to run and develop locally

1. `yarn install`
2. Create a new empty database in a Postgres server (you can run one via Postgres.app on a mac, or via Docker, or use one in the cloud somwhere)
3. Create a `.env` file (you can use `.env.dev` as model, just replace DATABASE_URI to an instance of Postgres database you created above)
4. `prisma migrate dev`. This will create all the tables in your database.
5. `npm run build`
6. Run any of the scripts from package.json, such as `npm run update-ownerships`

Note: to avoid re-building before running it's usually easier to use ts-node and run scripts directly, e.g. `ts-node src/metadata/ownerships-cron.ts`

### How it works in prod

We deploy to Heroku and use a cron to run scripts from packages.json on a timer.

### Where is the GraphQL part?

We rely on Hasura to give us a managed GraphQL API directly from our database. Sample queries are below (but you can use schema introspection to find all the fields and relationships). You can use this public endpoint (subject to change) for now. It has prod data updated roughly every 10 minutes: https://resolved-viper-89.hasura.app/v1/graphql


#### Token counts

```graphql
query Query {
  Soul_aggregate {
    aggregate {
      count
    }
  }
  Wizard_aggregate(where: {isBurnt: {_eq: false}}) {
    aggregate {
      count
    }
  }
  Pony_aggregate {
    aggregate {
      count
    }
  }
}
```

Result:

```json
{
  "data": {
    "Soul_aggregate": {
      "aggregate": {
        "count": 591
      }
    },
    "Wizard_aggregate": {
      "aggregate": {
        "count": 9409
      }
    },
    "Pony_aggregate": {
      "aggregate": {
        "count": 438
      }
    }
  }
}
```

### Owners of all the unburnt wizards with Fox Tricksters

```graphql
query Query {
  Wizard(where: {familiar: {_eq: "Fox Trickster"}, isBurnt: {_eq: false}}) {
    name
    familiar
    token {
      tokenId
      currentOwner
    }
  }
}
```

Results:

```json
{
  "data": {
    "Wizard": [
      {
        "name": "Hedge Wizard Ursula of the Steppe",
        "familiar": "Fox Trickster",
        "token": {
          "tokenId": 4564,
          "currentOwner": "0xe8AC16B8596604E95f5133c00981283a4Ec8d91E"
        }
      },
      {
        "name": "Void Disciple Voidoth of the Mist",
        "familiar": "Fox Trickster",
        "token": {
          "tokenId": 6573,
          "currentOwner": "0xed4a1320A4F65b08D006b7CA7b95F20E07d1D182"
        }
      },
      ...
```

#### Lore with images

```graphql
query Query {
  Lore(where: {images: {href: {_is_null: false}}}) {
    images {
      href
    }
    previewText
    token {
      tokenContract
      tokenId
      soul {
        name
      }
      pony {
        name
      }
      wizard {
        name
      }
    }
  }
}
```

Result:

```json
{
  "data": {
    "Lore": [
      {
        "images": [
          {
            "href": "ipfs://QmY7vGMtN8NvHZhsTdkv2Vpo1PNk4TfVA46YnuMAMMxbGJ/img_79_5erkjggg__.png"
          }
        ],
        "previewText": " ",
        "token": {
          "tokenContract": "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
          "tokenId": 79,
          "soul": null,
          "pony": null,
          "wizard": {
            "name": "Catherine The Great "
          }
        }
      },
      {
        "images": [
          {
            "href": "ipfs://QmbVNwW9pnc23gFiET8zAcLzkabSWW6iNDrACvGfGHRD4U/img_512_l__qx__9k_.jpeg"
          }
        ],
        "previewText": " ",
        "token": {
          "tokenContract": "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
          "tokenId": 512,
          "soul": null,
          "pony": null,
          "wizard": {
            "name": "Witch Florah of the Mountain"
          }
        }
      },
```

#### Last 10 lore entries

```graphql
query MyQuery {
  Lore(order_by: {createdAtBlock: desc}, limit: 10) {
    createdAtBlock
    images {
      href
    }
    nsfw
    previewText
    token {
      tokenId
      tokenContract
    }
  }
}
```

Results:

```json
{
  "data": {
    "Lore": [
      {
        "createdAtBlock": 14133514,
        "images": [],
        "nsfw": false,
        "previewText": "Lo weary wanderer, sit ye down and harken tale of young blood icy in its veins, seeking an adventure worthy of the ancestors!Oberon was a man of the ancient way, knowing the face of his father, abiding the admonitions of the great old gods.He was not comforted by the luxury of th...",
        "token": {
          "tokenId": 2473,
          "tokenContract": "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42"
        }
      },
      {
        "createdAtBlock": 14132854,
        "images": [],
        "nsfw": false,
        "previewText": "PrologueIn a dark space of the high-tier reality, a Controller scrutinized the Life of Wizards searching for signs. \nAnd there he found the young Mage, and observed his Life.The Controller admitted the boy had raw potential in his plane of existence and he was naturally connected...",
        "token": {
          "tokenId": 6063,
          "tokenContract": "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42"
        }
      },
      ...
```

### Full lore contents for Arcadian Masters

```graphql
query MyQuery {
  Wizard(where: {head: {_ilike: "Arcadian Master"}}) {
    head
    name
    image
    token {
      tokenId
      lore {
        markdownText
        nsfw
        struck
        images {
          href
        }
      }
    }
  }
}
```

Results:

```json
  "data": {
    "Wizard": [
      {
        "head": "Arcadian Master",
        "name": "Sorcerer Basil of the Berg",
        "image": "ipfs://QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/5140.png",
        "token": {
          "tokenId": 5140,
          "lore": [
            {
              "markdownText": "# The Lore of Sorcerer Basil of the Berg\n\nOne of the founding members of Miyo’s Boys. Was initially kidnapped during Chaos Mage Miyo’s trip to the Gate to the 7th Realm. However, by the time a few days had passed, Basil was infatuated with Miyo, and followed her willingly.\n\n ![](ipfs://QmWQeZMvQXK5P1mp4YQsVfrM1n9H3SwzYc5HmfzNJYQf4s)\n\nThe only things Basil loved more than Miyo, were his familiar Icicle the blue rat, and his Egg of Unknown Origin. Basil had found the egg during one of his journeys out on the ice near his home, and he was certain that if he could get the creature to hatch, he would have the power to do whatever he wanted.\n\nOf course, getting the egg hatched is easier said than done. Various incantations, rituals, stress tests, and cooking methods were attempted. Yet none of them had any discernable effect on the egg.\n\nDuring the run-up to the Great Wizard Burning, Miyo acquired one of the Sacred Flames. Sensing an opportunity, Basil begged Miyo to let him and his egg be the ones to merge with the flame.\n\nAlthough Miyo had a few other burn candidates in mind, she was also curious to know what would happen if the egg were exposed to the flame…(to be continued)",
              "nsfw": false,
              "struck": false,
...
```