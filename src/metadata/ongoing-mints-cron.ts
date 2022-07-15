import { updateMissingPonies } from "./ponies";
import { updateMissingSouls } from "./souls";
import { updateMissingBeasts, updateMissingBeastSpawn } from "./beasts";
import { updateMissingWarriors } from "./warriors";
import { updateMissingBabyWizards } from "./baby-wizards";

async function updateMissingTokens() {
  if (process.env.SOULS_CONTRACT) {
    console.log("Indexing missing Souls....");
    await updateMissingSouls();
  } else {
    console.log(
      "Not indexing missing Souls as contract not set in env vars yet"
    );
  }

  if (process.env.PONIES_CONTRACT) {
    console.log("Indexing missing Ponies...");
    await updateMissingPonies();
  } else {
    console.log(
      "Not indexing missing Ponies as contract not set in env vars yet"
    );
  }
  if (process.env.BEASTS_CONTRACT) {
    console.log("Indexing missing Beasts...");
    await updateMissingBeasts();
  } else {
    console.log(
      "Not indexing missing Beasts as contract not set in env vars yet"
    );
  }
  if (process.env.BEASTSPAWN_CONTRACT) {
    console.log("Indexing missing Beast Spawn...");
    await updateMissingBeastSpawn();
  } else {
    console.log(
      "Not indexing missing Beast Spawn as contract not set in env vars yet"
    );
  }

  if (process.env.WARRIORS_CONTRACT) {
    console.log("Indexing missing Warriors...");
    await updateMissingWarriors();
  } else {
    console.log(
      "Not indexing missing Warriors as contract not set in env vars yet"
    );
  }

  if (process.env.BABY_WIZARDS_CONTRACT) {
    console.log("Indexing missing Baby wizards...");
    await updateMissingBabyWizards();
  } else {
    console.log("Not indexing missing Baby wizards...");
  }
}

updateMissingTokens();
