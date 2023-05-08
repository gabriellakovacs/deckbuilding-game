import { getGame, handleEndOfTurn, handleStartGame } from "./gameAPICalls.js";
import { gameToUpdateUiInput } from "./helpers.js";
import {
  handleGeneratePrivateNumber,
  handleUpdatePrivateNumber,
} from "./privateNumberAPICalls.js";
import {
  handleGeneratePublicNumber,
  handleUpdatePublicNumber,
} from "./publicNumberAPICalls.js";
import { updateUI } from "./uiUpdate.js";
import { handleCreateNewUser } from "./userAPICalls.js";

const checkGameState = async () => {
  const game = await getGame();
  updateUI(gameToUpdateUiInput(game));
};

checkGameState();

document
  .querySelector("#generatePublicNumberButton")
  .addEventListener("click", handleGeneratePublicNumber);
document
  .querySelector("#updatePublicNumberButton")
  .addEventListener("click", handleUpdatePublicNumber);
document
  .querySelector("#generatePrivateNumberButton")
  .addEventListener("click", handleGeneratePrivateNumber);
document
  .querySelector("#updatePrivateNumberButton")
  .addEventListener("click", handleUpdatePrivateNumber);
document
  .querySelector("#createUserButton")
  .addEventListener("click", handleCreateNewUser);
document
  .querySelector("#startGameButton")
  .addEventListener("click", handleStartGame);
document
  .querySelector("#endOfTurnButton")
  .addEventListener("click", handleEndOfTurn);
