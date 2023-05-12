import * as fs from "fs";
import { cardInGameToCardInPlayer, shuffleArray } from "../cardHelpers.js";
import { GAME_DB_PATH } from "../static/paths.js";
import { CardInGame, PlayerResponse } from "../static/types.js";
import { organizeCardsInHand } from "./../cardHelpers.js";

const NR_OF_CARDS_START_OF_TURN = 5;
const getPayerFilePath = (playerId: number) =>
  `${GAME_DB_PATH}/player_${playerId}.json`;

const isCardInPlayerType = (value: unknown): value is PlayerResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
};

const isPlayerType = (value: unknown): value is PlayerResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "throwPile" in value &&
    Array.isArray(value.throwPile) &&
    value.throwPile.reduce(
      (acc, card) => acc && isCardInPlayerType(card),
      true
    ) &&
    "drawPile" in value &&
    Array.isArray(value.drawPile) &&
    value.drawPile.reduce(
      (acc, card) => acc && isCardInPlayerType(card),
      true
    ) &&
    "hand" in value &&
    Array.isArray(value.hand) &&
    value.hand.reduce((acc, card) => acc && isCardInPlayerType(card), true)
  );
};

const getPlayerObjectById = (playerId): PlayerResponse => {
  try {
    const player = fs.readFileSync(getPayerFilePath(playerId), "utf8");
    const playerJson = player[0] === "{" ? JSON.parse(player) : {};
    if (!isPlayerType(playerJson)) {
      throw new Error(
        `Unexpected content of player_${playerId}.json does not align with Player type`
      );
    }
    return playerJson;
  } catch (error) {
    console.log(error);
  }
};

const createNewPlayerFile = (playerId: number) => {
  const newPlayerObject: PlayerResponse = {
    drawPile: [],
    throwPile: [],
    hand: [],
  };
  try {
    fs.writeFileSync(
      getPayerFilePath(playerId),
      JSON.stringify(newPlayerObject)
    );
    return playerId;
  } catch (error) {
    throw new Error(error);
  }
};

const updatePlayerFile = (
  playerId: number,
  newPlayerObject: PlayerResponse
) => {
  try {
    fs.writeFileSync(
      getPayerFilePath(playerId),
      JSON.stringify(newPlayerObject)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const saveCardsInPlayer = (
  cards: Array<CardInGame>,
  location: "drawPile" | "throwPile" | "hand",
  playerId: number
) => {
  const cardsToBeSaved = cardInGameToCardInPlayer(cards);
  const currentPlayerObject = getPlayerObjectById(playerId);
  const newPlayerobject = {
    ...currentPlayerObject,
    [location]: [...currentPlayerObject[location], ...cardsToBeSaved],
  };
  updatePlayerFile(playerId, newPlayerobject);
  return newPlayerobject;
};

const endOfTurnTasks = (playerId: number, playerObject: PlayerResponse) => {
  playerObject.throwPile = [...playerObject.throwPile, ...playerObject.hand];
  if (playerObject.drawPile.length <= NR_OF_CARDS_START_OF_TURN) {
    const shuffledThrowPile = shuffleArray(playerObject.throwPile);
    playerObject.throwPile = [];
    playerObject.drawPile = [...playerObject.drawPile, ...shuffledThrowPile];
  }
  playerObject.hand = organizeCardsInHand(playerObject.drawPile.splice(0, 5));
  updatePlayerFile(playerId, playerObject);
  return playerObject;
};

const savePrivateNumberInPlayer = ({
  privateNumber,
  playerId,
}: {
  privateNumber: number;
  playerId: number;
}) => {
  try {
    fs.writeFileSync(
      getPayerFilePath(playerId),
      JSON.stringify({ privateNumber })
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getPrivateNumberFromPlayer = (playerId: number) => {
  try {
    const playerObject = getPlayerObjectById(playerId);
    return playerObject.privateNumber || null;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createNewPlayerFile,
  savePrivateNumberInPlayer,
  getPrivateNumberFromPlayer,
  saveCardsInPlayer,
  endOfTurnTasks,
};
