import { updateMissingPonies } from "./ponies";
import { updateMissingSouls } from "./souls";
import { updateMissingBeasts, updateMissingBeastSpawn } from "./beasts";
import { updateMissingWarriors, WARRIORS_CONTRACT } from "./warriors";
import { updateMissingBabyWizards } from "./baby-wizards";

async function updateMissingTokens() {
  console.log("Souls...");
  await updateMissingSouls();

  console.log("Ponies...");
  await updateMissingPonies();

  console.log("Beasts...");
  await updateMissingBeasts();

  console.log("Beast spawn...");
  await updateMissingBeastSpawn();

  console.log("Warriors...");
  await updateMissingWarriors();

  console.log("Baby wizards...");
  await updateMissingBabyWizards();
}

updateMissingTokens();
