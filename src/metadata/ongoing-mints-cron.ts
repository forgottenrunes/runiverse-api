import { updateMissingPonies } from "./ponies";
import { updateMissingSouls } from "./souls";
import { updateMissingBeasts, updateMissingBeastSpawn } from "./beasts";
// import { updateMissingBeasts, updateMissingBeastSpawn } from "./beasts";

async function updateMissingTokens() {
  console.log("Souls...");
  await updateMissingSouls();

  console.log("Ponies...");
  await updateMissingPonies();

  console.log("Beasts...");
  await updateMissingBeasts();

  console.log("Beast spawn...");
  await updateMissingBeastSpawn();
}

updateMissingTokens();
