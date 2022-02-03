import { updateMissingPonies } from "./ponies";
import { updateMissingSouls } from "./souls";

async function updateMissingTokens() {
  console.log("Souls...");
  await updateMissingSouls();

  console.log("Ponies...");
  await updateMissingPonies();
}

updateMissingTokens();
