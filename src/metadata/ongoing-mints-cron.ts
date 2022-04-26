import { updateMissingPonies } from "./ponies";
import { updateMissingSouls } from "./souls";
import { updateMissingBeasts, updateMissingBeastSpawn } from "./beasts";
import { updateMissingWarriors, WARRIORS_CONTRACT } from "./warriors";

async function updateMissingTokens() {
  console.log("Souls...");
  await updateMissingSouls();

  console.log("Ponies...");
  await updateMissingPonies();

  console.log("Beasts...");
  await updateMissingBeasts();

  console.log("Beast spawn...");
  await updateMissingBeastSpawn();

  if (WARRIORS_CONTRACT) {
    console.log("Warriors...");
    await updateMissingWarriors();
  } else {
    console.log("Not updating warriors as no contract set yet...");
  }
}

updateMissingTokens();
