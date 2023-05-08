import * as fs from "fs";
import { GAME_DB_PATH } from "../static/paths.js";
import { getInitialDrawPile } from "../cardHelpers.js";
import { PlayerResponse } from "../static/types.js";

type Player = {
  privateNumber?: number;
};

const isPlayerType = (value: unknown): value is Player => {
  return typeof value === "object" && value !== null;
};

const getPlayerObjectById = (playerId): Player => {
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
  try {
    fs.writeFileSync(`${GAME_DB_PATH}/player_${nextPlayerId}.json`, "");
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

const saveInitialDrawPileInPlayer = (playerId: number): PlayerResponse => {
  const initialDrawPile = getInitialDrawPile();
  try {
    fs.writeFileSync(
      `${GAME_DB_PATH}/player_${playerId}.json`,
      JSON.stringify(initialDrawPile)
    );
    return initialDrawPile;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createNewPlayerFile,
  savePrivateNumberInPlayer,
  getPrivateNumberFromPlayer,
  saveInitialDrawPileInPlayer,
};
