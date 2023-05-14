import {
  updateGameAvailableCardsUI,
  updatePlayersTurnUI,
  updateUI,
} from "./uiUpdate.js";
import { GameResponse, WebSocketMessage } from "../types.js";
import { isGameResponseType, isPlayerResponseType } from "./types.js";

export const isWebSocketMessageType = (
  value: unknown
): value is WebSocketMessage => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string" &&
    (value.type === "game"
      ? "game" in value && isGameResponseType(value.game)
      : value.type === "player"
      ? "player" in value && isPlayerResponseType(value.player)
      : value.type === "publicNumber"
      ? "publicNumber" in value && typeof value.publicNumber === "number"
      : true)
  );
};

let game: GameResponse | undefined;
export const startWebSocket = () => {
  const webSocket = new WebSocket("ws://localhost:8080");
  webSocket.onopen = (event) => {
    console.log("webSocket open");
  };
  webSocket.onmessage = ({ data }) => {
    console.log(`Ws: BE is sending some data: ${data}`);
    const response: unknown = JSON.parse(data);
    if (isWebSocketMessageType(response)) {
      if (response.type === "publicNumber") {
        updatePublicNumber(JSON.parse(data).publicNumber);
        return;
      }
      if (response.type === "game") {
        updateUI(gameToUpdateUiInput(response.game));
        updateGameAvailableCardsUI(response.game);
        game = response.game;
        return;
      }
      if (
        response.type === "player" &&
        response.player.id === getPlayerIdFromCurrentUrl()
      ) {
        updatePlayersTurnUI({ ...response.player }, game);
        return;
      }
    }
  };
};

export const throwUnexpectedResponse = ({ method, url, jsonResponse }) => {
  throw new Error(
    `Unexpected response from ${method} ${url}. Recieved ${jsonResponse}`
  );
};

export const updatePublicNumber = (newPublicNumber) => {
  document.getElementById("publicNumber").innerHTML = newPublicNumber;
};

export const updatePrivateNumber = (newPrivateNumber) => {
  document.getElementById("privateNumber").innerHTML = newPrivateNumber;
};

export const getPlayerIdFromCurrentUrl = () => {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;
  const playerId = searchParams.get("playerId");
  return Number(playerId);
};

export const isYourTurn = (playerId, currentTurnPlayerId) => {
  return currentTurnPlayerId === playerId;
};

export const gameToUpdateUiInput = (game: GameResponse) => {
  const playerId = getPlayerIdFromCurrentUrl();
  const numberOfPlayers = game.playerIds.length;
  const isItYourTurn = isYourTurn(playerId, game.currentTurnPlayerId);

  return {
    hasGameStarted: game.hasStarted,
    isItYourTurn,
    playerId,
    numberOfPlayers,
  };
};
