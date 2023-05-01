import gameModel from "../models/gameModel.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const deleteGame = (req, res) => {
  gameModel.deleteGame();
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ success: true }));
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
    client.send(JSON.stringify({ publicNumber }));
  });

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ publicNumber }));
};

const updatePublicNumber = async (req, res, webSocketServer) => {
  const data = await getReqData(req);
  const publicNumber = JSON.parse(data)?.publicNumber;
  if (typeof publicNumber === "number") {
    gameModel.savePublicNumberInGame(publicNumber);

    webSocketServer.clients.forEach((client) => {
      client.send(JSON.stringify({ publicNumber }));
    });

    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, publicNumber }));
    return;
  }

  res.writeHead(200, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Expected a number, but got: ${typeof publicNumber}: ${publicNumber}`,
    })
  );
};

const createNewGame = () => {
  gameModel.createNewGame();
};

export default {
  deleteGame,
  getPublicNumber,
  createNewPublicNumber,
  updatePublicNumber,
  createNewGame,
};
