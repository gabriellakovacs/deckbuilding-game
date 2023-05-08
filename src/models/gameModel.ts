import * as fs from "fs";
import userModel from "./userModel.js";
import { GAME_DB_PATH } from "../static/paths.js";
import { GameResponse } from "../static/types.js";

const GAME_DB_FILE = "game.json";

const isGameType = (value: unknown): value is GameResponse => {
  return (
    typeof value === "object" && value !== null
    // && "publicNumber" in value &&
    // "userIds" in value &&
    // Array.isArray(value.userIds) &&
    // value.userIds.reduce((acc, current) => {
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

export const getCurrentUserIds = (): number[] => {
  const currentGame = getCurrentGameObject();
  return currentGame.userIds || [];
};

const createNewGame = () => {
  const newGameObject: GameResponse = {
    hasStarted: false,
    userIds: [],
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

const getNextUserId = () => {
  const existingUserIds = getCurrentUserIds();
  if (!existingUserIds) {
    return 1;
  }
  return existingUserIds.length + 1;
};

const saveNewUserIdInGame = () => {
  const currentGame = getCurrentGameObject();
  const nextUserId = getNextUserId();
  userModel.createNewUserFile(nextUserId);
  const newGameObject: GameResponse = {
    ...currentGame,
    userIds: currentGame.userIds
      ? [...currentGame.userIds, nextUserId]
      : [nextUserId],
  };
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/game.json`,
      JSON.stringify(newGameObject)
    );
    return { game: newGameObject, userId: nextUserId };
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

const getNextTurnUserId = (currentGameObject: GameResponse) => {
  const { currentTurnUserId } = currentGameObject;
  const currentTurnUserIdIndex =
    currentGameObject.userIds.indexOf(currentTurnUserId);
  return currentTurnUserIdIndex === currentGameObject.userIds.length - 1
    ? currentGameObject.userIds[0]
    : currentGameObject.userIds[currentTurnUserIdIndex + 1];
};

const saveCurrentTurnUserIdInGame = (): GameResponse => {
  try {
    const currentGameObject = getCurrentGameObject();
    const nextTurnUserId = getNextTurnUserId(currentGameObject);
    const newGameObject: GameResponse = {
      ...currentGameObject,
      currentTurnUserId: nextTurnUserId,
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
      currentTurnUserId: currentGameObject.userIds[0],
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
  getCurrentUserIds,
  saveGameStart,
  saveCurrentTurnUserIdInGame,
  saveNewUserIdInGame,
};
