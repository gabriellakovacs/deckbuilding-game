import * as fs from "fs";
import playerModel from "./playerModel.js";
import { GAME_DB_PATH } from "../static/paths.js";
import { GameResponse } from "../static/types.js";
import { getOriginalAvailableCards } from "../cardHelpers.js";

const GAME_DB_FILE = "game.json";

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

export const getCurrentGameObject = (): GameResponse => {
  try {
    const currentGame = fs.readFileSync(
      `${GAME_DB_PATH}/${GAME_DB_FILE}`,
      "utf8"
    );
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

const createNewGame = () => {
  const newGameObject: GameResponse = {
    hasStarted: false,
    playerIds: [],
  };
  try {
    if (!fs.existsSync(GAME_DB_PATH)) {
      fs.mkdirSync(GAME_DB_PATH);
    }
    fs.writeFileSync(
      `${GAME_DB_PATH}/${GAME_DB_FILE}`,
      JSON.stringify(newGameObject)
    );
  } catch (error) {
    throw new Error(error);
  }
};

const deleteGame = () => {
  try {
    fs.rmSync(GAME_DB_PATH, { recursive: true, force: true });
  } catch (error) {
    throw new Error(error);
  }
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
    playerIds: currentGame.playerIds
      ? [...currentGame.playerIds, nextPlayerId]
      : [nextPlayerId],
  };
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/game.json`,
      JSON.stringify(newGameObject)
    );
    return { game: newGameObject, playerId: nextPlayerId };
  } catch (error) {
    throw new Error(error);
  }
};

const savePublicNumberInGame = (publicNumber: number) => {
  try {
    const currentGameObject = getCurrentGameObject();
    const newGameObject: GameResponse = {
      ...currentGameObject,
      publicNumber,
    };
    fs.writeFileSync(
      `${GAME_DB_PATH}/${GAME_DB_FILE}`,
      JSON.stringify(newGameObject)
    );
  } catch (error) {
    throw new Error(error);
  }
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
    fs.writeFileSync(
      `${GAME_DB_PATH}/${GAME_DB_FILE}`,
      JSON.stringify(newGameObject)
    );
    return newGameObject;
  } catch (error) {
    throw new Error(error);
  }
};

const saveGameStart = () => {
  try {
    const currentGameObject = getCurrentGameObject();
    const newGameObject: GameResponse = {
      ...currentGameObject,
      hasStarted: true,
      currentTurnPlayerId: currentGameObject.playerIds[0],
      availableCards: getOriginalAvailableCards(),
    };
    fs.writeFileSync(
      `${GAME_DB_PATH}/${GAME_DB_FILE}`,
      JSON.stringify(newGameObject)
    );
    return newGameObject;
  } catch (error) {
    throw new Error(error);
  }
};

const getPublicNumberFromGame = (): number | null => {
  try {
    const currentGameObject = getCurrentGameObject();
    return currentGameObject?.publicNumber || null;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  deleteGame,
  getPublicNumberFromGame,
  savePublicNumberInGame,
  createNewGame,
  getCurrentGameObject,
  getCurrentPlayerIds,
  saveGameStart,
  saveCurrentTurnPlayerIdInGame,
  saveNewPlayerIdInGame,
};
