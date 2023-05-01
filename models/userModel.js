import fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";
import gameHelpers from "./gameModel.js";

const getUserObjectById = (userId) => {
  try {
    const user = fs.readFileSync(`${GAME_DB_PATH}/user_${userId}.json`, "utf8");
    return user[0] === "{" ? JSON.parse(user) : {};
  } catch (error) {
    console.log(error);
  }
};

const getNextUserId = (currentGame) => {
  const existingUserIds = currentGame.userIds;
  if (!existingUserIds) {
    return 1;
  }
  return existingUserIds.length + 1;
};

const saveNewUserIdInGame = () => {
  const currentGame = gameHelpers.getCurrentGameObject();
  const nextUserId = getNextUserId(currentGame);

  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/game.json`,
      JSON.stringify({
        ...currentGame,
        userIds: currentGame.userIds
          ? [...currentGame.userIds, nextUserId]
          : [nextUserId],
      })
    );
    return nextUserId;
  } catch (error) {
    throw new Error(error);
  }
};

const createNewUserFile = () => {
  const nextUserId = saveNewUserIdInGame();

  try {
    fs.writeFileSync(`${GAME_DB_PATH}/user_${nextUserId}.json`, "");
    return nextUserId;
  } catch (error) {
    throw new Error(error);
  }
};

const savePrivateNumberInUser = ({ privateNumber, userId }) => {
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/user_${userId}.json`,
      JSON.stringify({ privateNumber })
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getPrivateNumberFromUser = (userId) => {
  try {
    const userObject = getUserObjectById(userId);
    return userObject.privateNumber || null;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createNewUserFile,
  savePrivateNumberInUser,
  getPrivateNumberFromUser,
};
