import {
  updateGameAvailableCardsUI,
  updatePlayersTurnUI,
  updateUI,
} from "./uiUpdate.js";
import { GameResponse, WebSocketMessage } from "../types.js";
import { isGameResponseType } from "./types.js";

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
      : value.type === "publicNumber"
      ? "publicNumber" in value && typeof value.publicNumber === "number"
      : true)
  );
};

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
        return;
      }
      if (response.type === "player") {
        updatePlayersTurnUI(response.player);
        return;
      }
    }
  };
};

export const throwMissingPropError = ({
  method,
  url,
  jsonResponse,
  propName,
}) => {
  throw new Error(
    `Missing prop ${propName} from response to ${method} ${url}. Recieved ${jsonResponse}`
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
