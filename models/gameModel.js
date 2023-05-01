import fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";

const getCurrentGameObject = () => {
  try {
    const currentGame = fs.readFileSync(`${GAME_DB_PATH}/game.json`, "utf8");
    return currentGame[0] === "{" ? JSON.parse(currentGame) : {};
  } catch (error) {
    throw new Error(error);
  }
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

const savePublicNumberInGame = (publicNumber) => {
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

const getPublicNumberFromGame = () => {
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
};
