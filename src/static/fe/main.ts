import { getGame, handleEndOfTurn, handleStartGame } from "./gameAPICalls.js";
import { gameToUpdateUiInput, startWebSocket } from "./helpers.js";
import { handleCreateNewPlayer } from "./playerAPICalls.js";
import { updateUI } from "./uiUpdate.js";

const checkGameState = async () => {
  const game = await getGame();
  updateUI(gameToUpdateUiInput(game));
};

checkGameState();
startWebSocket();

document
  .querySelector("#createPlayerButton")
  .addEventListener("click", handleCreateNewPlayer);
document
  .querySelector("#startGameButton")
  .addEventListener("click", handleStartGame);
document
  .querySelector("#endOfTurnButton")
  .addEventListener("click", handleEndOfTurn);
