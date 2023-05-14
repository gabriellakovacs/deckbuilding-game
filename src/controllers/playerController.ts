import playerModel from "../models/playerModel.js";
import { getCurrentPlayerIds } from "../models/gameModel.js";
import { getReqData } from "../utils.js";
import { isPlayerResponseType } from "../static/fe/types.js";
import { createWebSocketMessagePlayer } from "../helpers.js";

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

const savePlayer = async (req, res, webSocketServer) => {
  const data = await getReqData(req);
  if (typeof data !== "string") {
    throw new Error(`Invalid data type: ${typeof data} for savePlayer`);
  }
  const playerObject: unknown = JSON.parse(data);

  if (isPlayerResponseType(playerObject)) {
    if (!isValidPlayerId(playerObject.id)) {
      resWrongPlayerId(res, playerObject.id);
      return;
    }
    playerModel.updatePlayerFile(playerObject);
    webSocketServer.clients.forEach((client) => {
      client.send(createWebSocketMessagePlayer(playerObject));
    });
    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, data: playerObject }));
    return;
  }
  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Unexpected request data type: ${typeof playerObject}: ${playerObject} - expected PlayerResponseType`,
    })
  );
};

export default {
  savePlayer,
};
