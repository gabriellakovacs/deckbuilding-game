import * as fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";
import { CardInGame, CardInPlayer, PlayerResponse } from "../static/types.js";

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
    const player = fs.readFileSync(
      `${GAME_DB_PATH}/player_${playerId}.json`,
      "utf8"
    );
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

const createNewPlayerFile = (nextPlayerId: number) => {
  const newPlayerObject: PlayerResponse = {
    drawPile: [],
    throwPile: [],
    hand: [],
  };
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/player_${nextPlayerId}.json`,
      JSON.stringify(newPlayerObject)
    );
    return nextPlayerId;
  } catch (error) {
    throw new Error(error);
  }
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
      `${GAME_DB_PATH}/player_${playerId}.json`,
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

const cardInGameToCardInPlayer = (
  cards: Array<CardInGame>
): Array<CardInPlayer> => {
  const cardsInPlayer = [];
  cards.forEach((card) => {
    for (let i = 0; i < card.nrOfCards; i++) {
      cardsInPlayer.push({ name: card.name });
    }
  });
  return cardsInPlayer;
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
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/player_${playerId}.json`,
      JSON.stringify(newPlayerobject)
    );
    return newPlayerobject;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createNewPlayerFile,
  savePrivateNumberInPlayer,
  getPrivateNumberFromPlayer,
  saveCardsInPlayer,
};
