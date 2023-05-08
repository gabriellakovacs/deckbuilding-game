import playerModel from "../models/playerModel.js";
import { getCurrentPlayerIds } from "../models/gameModel.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const isValidPlayerId = (playerId: unknown) => {
  if (
    playerId === null ||
    playerId === undefined ||
    typeof Number(playerId) !== "number"
  ) {
    return false;
  }
  const existingPlayerIds = getCurrentPlayerIds();
  return existingPlayerIds.includes(Number(playerId));
};

const resWrongPlayerId = (res, playerId) => {
  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Id: ${playerId} does not exist`,
    })
  );
};

const getPrivateNumber = (req, res) => {
  const playerId = req.url.split("/")[3];

  if (!isValidPlayerId(playerId)) {
    resWrongPlayerId(res, playerId);
    return;
  }
  const privateNumber = playerModel.getPrivateNumberFromPlayer(playerId);
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const createNewPrivateNumber = (req, res) => {
  const playerId = req.url.split("/")[3];

  if (!isValidPlayerId(playerId)) {
    resWrongPlayerId(res, playerId);
    return;
  }
  const privateNumber = Math.round(Math.random() * 100);
  playerModel.savePrivateNumberInPlayer({ privateNumber, playerId: playerId });
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const updatePrivateNumber = async (req, res) => {
  const playerId = req.url.split("/")[3];

  if (!isValidPlayerId(playerId)) {
    resWrongPlayerId(res, playerId);
    return;
  }
  const data = await getReqData(req);
  if (typeof data !== "string") {
    throw new Error(
      `Invalid data type: ${typeof data} for updatePrivateNumber`
    );
  }
  const privateNumber = JSON.parse(data)?.privateNumber;

  if (typeof privateNumber === "number") {
    playerModel.savePrivateNumberInPlayer({
      playerId,
      privateNumber,
    });
    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, privateNumber }));
    return;
  }

  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Expected a number, but got: ${typeof privateNumber}: ${privateNumber}`,
    })
  );
};

export default {
  getPrivateNumber,
  createNewPrivateNumber,
  updatePrivateNumber,
};
