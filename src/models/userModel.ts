import * as fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";
import gameHelpers from "./gameModel.js";

type User = {
  privateNumber?: number;
};

const isUserType = (value: unknown): value is User => {
  return typeof value === "object" && value !== null;
};

const getUserObjectById = (userId): User => {
  try {
    const user = fs.readFileSync(`${GAME_DB_PATH}/user_${userId}.json`, "utf8");
    const userJson = user[0] === "{" ? JSON.parse(user) : {};
    if (!isUserType(userJson)) {
      throw new Error(
        `Unexpected content of user_${userId}.json does not align with User type`
      );
    }
    return userJson;
  } catch (error) {
    console.log(error);
  }
};

const getNextUserId = () => {
  const existingUserIds = gameHelpers.getCurrentUserIds();
  if (!existingUserIds) {
    return 1;
  }
  return existingUserIds.length + 1;
};

const saveNewUserIdInGame = () => {
  const currentGame = gameHelpers.getCurrentGameObject();
  const nextUserId = getNextUserId();

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

const savePrivateNumberInUser = ({
  privateNumber,
  userId,
}: {
  privateNumber: number;
  userId: number;
}) => {
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/user_${userId}.json`,
      JSON.stringify({ privateNumber })
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getPrivateNumberFromUser = (userId: number) => {
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
