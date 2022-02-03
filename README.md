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
4. `prisma migrate dev`. This will create all the datables in your database.
5. `npm run build`
6. Run any of the scripts from package.json, such as `npm run update-ownerships`

Note: to avoid re-building before running it's usually easier to use ts-node and run scripts directly, e.g. `ts-node src/metadata/ownerships=cron.ts`

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
