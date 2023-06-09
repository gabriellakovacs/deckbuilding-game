import * as http from "http";
import * as fs from "fs";
import { WebSocketServer } from "ws";
import Game from "./controllers/gameController.js";
import Player from "./controllers/playerController.js";
import Paths from "./static/paths.js";

const PORT = process.env.PORT || 5000;
const webSocketServer = new WebSocketServer({ port: 8080 });

webSocketServer.on("connection", (socket) => {
  console.log("WS connected");
  socket.on("message", (message) => {
    console.log(`WS message ${message}`);
  });
});

const server = http.createServer(async (req, res) => {
  // HOME HTML
  if (
    (req.url === "/" && req.method === "GET") ||
    (req.url.match(/\/\?playerId\=([0-9]+)/) && req.method === "GET")
  ) {
    try {
      const homeHtml = fs.readFileSync(Paths.INDEX_HTML_PATH, "utf8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(homeHtml);
      res.end();
    } catch (error) {
      console.log(error);
    }
  }

  // STATIC FE FILES
  else if (
    req.url.match(/\/public\/static\/fe\/(\w+)/) &&
    req.method === "GET"
  ) {
    try {
      const staticPath = req.url.split("/")[4];
      const staticFile = fs.readFileSync(
        `${Paths.STATIC_FE_FILES_PATH}/${staticPath}`,
        "utf8"
      );
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(staticFile);
      res.end();
    } catch (error) {
      console.log(error);
    }
  }

  // STATIC FILES
  else if (req.url.match(/\/public\/static\/(\w+)/) && req.method === "GET") {
    try {
      const staticPath = req.url.split("/")[3];
      const staticFile = fs.readFileSync(
        `${Paths.STATIC_FILES_PATH}/${staticPath}`,
        "utf8"
      );
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(staticFile);
      res.end();
    } catch (error) {
      console.log(error);
    }
  }

  // API
  else if (req.url === Paths.API_GAME && req.method === "GET") {
    Game.getGame(req, res);
  } else if (req.url === Paths.API_GAME && req.method === "PUT") {
    Game.saveGame(req, res, webSocketServer);
  } else if (req.url === Paths.API_GAME && req.method === "DELETE") {
    Game.deleteGame(req, res);
  } else if (req.url === Paths.API_CREATE_PLAYER && req.method === "POST") {
    await Game.addPlayerToGame(req, res, webSocketServer);
  } else if (req.url === Paths.API_START_GAME && req.method === "POST") {
    await Game.startGame(req, res, webSocketServer);
  } else if (req.url.match(Paths.API_END_TURN) && req.method === "POST") {
    await Game.endTurn(req, res, webSocketServer);
  } else if (req.url === Paths.API_PLAYER && req.method === "PUT") {
    await Player.savePlayer(req, res, webSocketServer);
  }

  // DEFAULT
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

Game.createNewGame();
server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
