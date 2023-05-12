import * as fs from "fs";
import {
  getInitialDeckForGame,
  getInitialDeckForPlayer,
} from "../static/cardHelpers.js";
import { GAME_DB_PATH } from "../static/paths.js";
import { GameResponse, PlayerResponse } from "../static/types.js";
import type { CardInGame } from "./../static/types";
import playerModel from "./playerModel.js";

const GAME_DB_FILE_PATH = `${GAME_DB_PATH}/game.json`;

const isGameType = (value: unknown): value is GameResponse => {
  return (
    typeof value === "object" && value !== null
    // && "publicNumber" in value &&
    // "playerIds" in value &&
    // Array.isArray(value.playerIds) &&
    // value.playerIds.reduce((acc, current) => {
    //   return current && typeof acc === "number";
    // })
  );
};

const updateGameFile = (newGameObject: GameResponse) => {
  try {
    fs.writeFileSync(GAME_DB_FILE_PATH, JSON.stringify(newGameObject));
  } catch (error) {
    throw new Error(error);
  }
};

const createNewGameFile = () => {
  try {
    if (!fs.existsSync(GAME_DB_PATH)) {
      fs.mkdirSync(GAME_DB_PATH);
    }
    updateGameFile({
      hasStarted: false,
      playerIds: [],
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentGameObject = (): GameResponse => {
  try {
    const currentGame = fs.readFileSync(GAME_DB_FILE_PATH, "utf8");
    const currentGameJson =
      currentGame[0] === "{" ? JSON.parse(currentGame) : {};
    if (!isGameType(currentGameJson)) {
      throw new Error(
        "Unexpected content of game.json does not align with Game type"
      );
    }
    return currentGameJson;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentPlayerIds = (): number[] => {
  const currentGame = getCurrentGameObject();
  return currentGame.playerIds || [];
};

const getNextPlayerId = () => {
  const existingPlayerIds = getCurrentPlayerIds();
  if (!existingPlayerIds) {
    return 1;
  }
  return existingPlayerIds.length + 1;
};

const saveNewPlayerIdInGame = () => {
  const currentGame = getCurrentGameObject();
  const nextPlayerId = getNextPlayerId();
  playerModel.createNewPlayerFile(nextPlayerId);
  const newGameObject: GameResponse = {
    ...currentGame,
    playerIds: [...currentGame.playerIds, nextPlayerId],
  };
  updateGameFile(newGameObject);
  return { game: newGameObject, playerId: nextPlayerId };
};

const getNextTurnPlayerId = (currentGameObject: GameResponse) => {
  const { currentTurnPlayerId } = currentGameObject;
  const currentTurnPlayerIdIndex =
    currentGameObject.playerIds.indexOf(currentTurnPlayerId);
  return currentTurnPlayerIdIndex === currentGameObject.playerIds.length - 1
    ? currentGameObject.playerIds[0]
    : currentGameObject.playerIds[currentTurnPlayerIdIndex + 1];
};

const saveCurrentTurnPlayerIdInGame = (): GameResponse => {
  try {
    const currentGameObject = getCurrentGameObject();
    const nextTurnPlayerId = getNextTurnPlayerId(currentGameObject);
    const newGameObject: GameResponse = {
      ...currentGameObject,
      currentTurnPlayerId: nextTurnPlayerId,
    };
    updateGameFile(newGameObject);
    return newGameObject;
  } catch (error) {
    throw new Error(error);
  }
};

const saveGameStart = (): {
  game: GameResponse;
  players: { playerId: number; player: PlayerResponse }[];
} => {
  try {
    const currentGameObject = getCurrentGameObject();
    const newGameObject: GameResponse = {
      ...currentGameObject,
      hasStarted: true,
      currentTurnPlayerId: currentGameObject.playerIds[0],
      availableCards: getInitialDeckForGame(),
    };

    updateGameFile(newGameObject);

    const initialDeckForPlayer = getInitialDeckForPlayer();

    const players: { playerId: number; player: PlayerResponse }[] = [];

    newGameObject.playerIds.forEach((playerId) => {
      const { player: initialPlayerState } = moveCardsFromGameToPlayer(
        initialDeckForPlayer,
        playerId,
        "throwPile"
      );
      const player = playerModel.endOfTurnTasks(playerId, initialPlayerState);
      players.push({ playerId, player });
    });

    return { game: newGameObject, players };
  } catch (error) {
    throw new Error(error);
  }
};

const removeCardsFromGameObject = (
  cards: Array<CardInGame>,
  currentGameObject: GameResponse
) => {
  cards.forEach((card) => {
    currentGameObject.availableCards.every((availableCard) => {
      if (availableCard.name === card.name) {
        availableCard.nrOfCards = availableCard.nrOfCards - card.nrOfCards;
        return false;
      }
      return true;
    });
  });
  return currentGameObject;
};

const removeCardsFromGameDb = (cards: Array<CardInGame>) => {
  const currentGameObject = getCurrentGameObject();
  removeCardsFromGameObject(cards, currentGameObject);
  updateGameFile(currentGameObject);
};

export const moveCardsFromGameToPlayer = (
  cards: Array<CardInGame>,
  playerId: number,
  location: "drawPile" | "throwPile" | "hand"
) => {
  const game = removeCardsFromGameDb(cards);
  const player = playerModel.saveCardsInPlayer(cards, location, playerId);
  return { game, player };
};

const savePublicNumberInGame = (publicNumber: number) => {
  const currentGameObject = getCurrentGameObject();
  updateGameFile({
    ...currentGameObject,
    publicNumber,
  });
};

const getPublicNumberFromGame = (): number | null => {
  try {
    const currentGameObject = getCurrentGameObject();
    return currentGameObject?.publicNumber || null;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteEntireDb = () => {
  try {
    fs.rmSync(GAME_DB_PATH, { recursive: true, force: true });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  deleteGame: deleteEntireDb,
  getPublicNumberFromGame,
  savePublicNumberInGame,
  createNewGameFile,
  getCurrentGameObject,
  getCurrentPlayerIds,
  saveGameStart,
  saveCurrentTurnPlayerIdInGame,
  saveNewPlayerIdInGame,
};
