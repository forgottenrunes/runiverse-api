import { PONIES_CONTRACT, updateMissingPonies } from "./ponies";
import { SOULS_CONTRACT, updateMissingSouls } from "./souls";
import {
  BEASTS_CONTRACT,
  BEASTSPAWN_CONTRACT,
  updateMissingBeasts,
  updateMissingBeastSpawn,
} from "./beasts";
import { updateMissingWarriors, WARRIORS_CONTRACT } from "./warriors";
import {
  BABY_WIZARDS_CONTRACT,
  updateMissingBabyWizards,
} from "./baby-wizards";

async function updateMissingTokens() {
  if (SOULS_CONTRACT) {
    console.log("Indexing missing Souls....");
    await updateMissingSouls();
  } else {
    console.log(
      "Not indexing missing Souls as contract not set in env vars yet"
    );
  }

  if (PONIES_CONTRACT) {
    console.log("Indexing missing Ponies...");
    await updateMissingPonies();
  } else {
    console.log(
      "Not indexing missing Ponies as contract not set in env vars yet"
    );
  }
  if (BEASTS_CONTRACT) {
    console.log("Indexing missing Beasts...");
    await updateMissingBeasts();
  } else {
    console.log(
      "Not indexing missing Beasts as contract not set in env vars yet"
    );
  }
  if (BEASTSPAWN_CONTRACT) {
    console.log("Indexing missing Beast Spawn...");
    await updateMissingBeastSpawn();
  } else {
    console.log(
      "Not indexing missing Beast Spawn as contract not set in env vars yet"
    );
  }

  if (WARRIORS_CONTRACT) {
    console.log("Indexing missing Warriors...");
    await updateMissingWarriors();
  } else {
    console.log(
      "Not indexing missing Warriors as contract not set in env vars yet"
    );
  }

  if (BABY_WIZARDS_CONTRACT) {
    console.log("Indexing missing Baby wizards...");
    await updateMissingBabyWizards();
  } else {
    console.log("Not indexing missing Baby wizards...");
  }
}

updateMissingTokens();
