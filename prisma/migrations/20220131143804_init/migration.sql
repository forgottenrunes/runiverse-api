CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "lore_update" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "up_to_block_number" INTEGER NOT NULL,
    "time_taken" INTEGER NOT NULL,

    CONSTRAINT "lore_update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token_contract" TEXT NOT NULL,
    "token_id" INTEGER NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lore_image" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "href" TEXT NOT NULL,
    "lore_id" UUID NOT NULL,

    CONSTRAINT "lore_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lore" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "raw_content" JSONB,
    "background_color" TEXT,
    "markdown_text" TEXT,
    "preview_text" TEXT,
    "lore_token_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "creator" TEXT NOT NULL,
    "parent_lore_index" INTEGER NOT NULL,
    "lore_metadata_uri" TEXT,
    "tx_hash" TEXT NOT NULL,
    "created_at_block" BIGINT NOT NULL,
    "nsfw" BOOLEAN NOT NULL,
    "struck" BOOLEAN NOT NULL,
    "discord_notified" BOOLEAN NOT NULL DEFAULT false,
    "twitter_notified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wizard" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token_id" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "background_color" TEXT,
    "body" TEXT,
    "head" TEXT,
    "prop" TEXT,
    "familiar" TEXT,
    "rune" TEXT,
    "is_burnt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wizard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "soul" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token_id" UUID NOT NULL,
    "transmuted_from_token_id" UUID NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "background" TEXT,
    "background_color" TEXT,
    "body" TEXT,
    "head" TEXT,
    "prop" TEXT,
    "familiar" TEXT,
    "rune" TEXT,
    "burn_index" INTEGER NOT NULL,

    CONSTRAINT "soul_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "souls_update" (
    "id" UUID NOT NULL DEFAULT (uuid_generate_v4()),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "up_to_block_number" INTEGER NOT NULL,
    "time_taken" INTEGER NOT NULL,

    CONSTRAINT "souls_update_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lore_update_up_to_block_number_key" ON "lore_update"("up_to_block_number");

-- CreateIndex
CREATE UNIQUE INDEX "token_token_contract_token_id_key" ON "token"("token_contract", "token_id");

-- CreateIndex
CREATE UNIQUE INDEX "lore_image_lore_id_href_key" ON "lore_image"("lore_id", "href");

-- CreateIndex
CREATE UNIQUE INDEX "lore_tx_hash_key" ON "lore"("tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "wizard_token_id_key" ON "wizard"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "soul_token_id_key" ON "soul"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "soul_transmuted_from_token_id_key" ON "soul"("transmuted_from_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "souls_update_up_to_block_number_key" ON "souls_update"("up_to_block_number");

-- AddForeignKey
ALTER TABLE "lore_image" ADD CONSTRAINT "lore_image_lore_id_fkey" FOREIGN KEY ("lore_id") REFERENCES "lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lore" ADD CONSTRAINT "lore_lore_token_id_fkey" FOREIGN KEY ("lore_token_id") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wizard" ADD CONSTRAINT "wizard_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soul" ADD CONSTRAINT "soul_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soul" ADD CONSTRAINT "soul_transmuted_from_token_id_fkey" FOREIGN KEY ("transmuted_from_token_id") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
