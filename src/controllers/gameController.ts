import {
  createWebSocketMessageGame,
  createWebSocketMessagePlayer,
} from "../helpers.js";
import gameModel from "../models/gameModel.js";
import { isGameResponseType } from "../static/fe/types.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const createNewGame = () => {
  gameModel.createNewGameFile();
};

const getGame = (req, res) => {
  const game = gameModel.getCurrentGameObject();

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

const deleteGame = (req, res) => {
  gameModel.deleteGame();
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true }));
};

const saveGame = async (req, res, webSocketServer) => {
  const data = await getReqData(req);
  if (typeof data !== "string") {
    throw new Error(`Invalid data type: ${typeof data} for saveGame`);
  }
  const gameObject: unknown = JSON.parse(data);

  if (isGameResponseType(gameObject)) {
    gameModel.updateGameFile(gameObject);
    webSocketServer.clients.forEach((client) => {
      client.send(createWebSocketMessageGame(gameObject));
    });
    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, data: gameObject }));
    return;
  }

  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Unexpected request data type: ${typeof gameObject}: ${gameObject} - expected GameResponseType`,
    })
  );
};

const startGame = (req, res, webSocketServer) => {
  const { game, players } = gameModel.saveGameStart();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));

    // TODO: figure out how to send the player's own hand to each player
    players.forEach((player) => {
      client.send(createWebSocketMessagePlayer(player));
    });
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

const addPlayerToGame = async (req, res, webSocketServer) => {
  // TODO: max 4 players for now?
  const { game, playerId } = await gameModel.saveNewPlayerIdInGame();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: { game, playerId } }));
};

const endTurn = (req, res, webSocketServer) => {
  const game = gameModel.saveCurrentTurnPlayerIdInGame();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

export default {
  saveGame,
  deleteGame,
  createNewGame,
  startGame,
  endTurn,
  getGame,
  addPlayerToGame,
};
