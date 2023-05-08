import {
  createWebSocketMessageGame,
  createWebSocketMessagePlayer,
} from "../helpers.js";
import gameModel from "../models/gameModel.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const createNewGame = () => {
  gameModel.createNewGame();
};

const deleteGame = (req, res) => {
  gameModel.deleteGame();
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true }));
};

const createPlayer = async (req, res, webSocketServer) => {
  //TODO: max 4 players for now?
  const { game, playerId } = await gameModel.saveNewPlayerIdInGame();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: { game, playerId } }));
};

const getPublicNumber = (req, res) => {
  const publicNumber = gameModel.getPublicNumberFromGame();

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ publicNumber }));
};

const createNewPublicNumber = (req, res, webSocketServer) => {
  const publicNumber = Math.round(Math.random() * 100);
  gameModel.savePublicNumberInGame(publicNumber);

  webSocketServer.clients.forEach((client) => {
    client.send(JSON.stringify({ type: "publicNumber", publicNumber }));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ publicNumber }));
};

const updatePublicNumber = async (req, res, webSocketServer) => {
  const data = await getReqData(req);
  if (typeof data !== "string") {
    throw new Error(`Invalid data type: ${typeof data} for updatePublicNumber`);
  }
  const publicNumber = JSON.parse(data)?.publicNumber;
  if (typeof publicNumber === "number") {
    gameModel.savePublicNumberInGame(publicNumber);

    webSocketServer.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "publicNumber", publicNumber }));
    });

    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, publicNumber }));
    return;
  }

  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Expected a number, but got: ${typeof publicNumber}: ${publicNumber}`,
    })
  );
};

const startGame = (req, res, webSocketServer) => {
  const { game, players } = gameModel.saveGameStart();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));

    //TODO: figure out how to send the plaayer's own hand to each player
    players.forEach((player) => {
      client.send(createWebSocketMessagePlayer(player.player));
    });
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

const endTurn = (req, res, webSocketServer) => {
  const game = gameModel.saveCurrentTurnPlayerIdInGame();

  webSocketServer.clients.forEach((client) => {
    client.send(createWebSocketMessageGame(game));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

const getGame = (req, res) => {
  const game = gameModel.getCurrentGameObject();

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true, data: game }));
};

export default {
  deleteGame,
  getPublicNumber,
  createNewPublicNumber,
  updatePublicNumber,
  createNewGame,
  startGame,
  endTurn,
  getGame,
  createPlayer,
};
