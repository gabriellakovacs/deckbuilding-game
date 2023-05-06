import * as fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";

type Game = {
  publicNumber?: number;
  userIds?: number[];
};

const isGameType = (value: unknown): value is Game => {
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

const getCurrentGameObject = (): Game => {
  try {
    const currentGame = fs.readFileSync(`${GAME_DB_PATH}/game.json`, "utf8");
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
  try {
    if (!fs.existsSync(GAME_DB_PATH)) {
      fs.mkdirSync(GAME_DB_PATH);
    }
    fs.writeFileSync(`${GAME_DB_PATH}/game.json`, "");
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

const savePublicNumberInGame = (publicNumber: number) => {
  try {
    const currentGameObject = getCurrentGameObject();
    fs.writeFileSync(
      `${GAME_DB_PATH}/game.json`,
      JSON.stringify({ ...currentGameObject, publicNumber })
    );
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
};
