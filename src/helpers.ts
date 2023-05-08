import { GameResponse, PlayerResponse, WebSocketMessage } from "./static/types";

export const createWebSocketMessageGame = (value: GameResponse): string => {
  const message: WebSocketMessage = {
    type: "game",
    game: value,
  };
  return JSON.stringify(message);
};

export const createWebSocketMessagePlayer = (value: PlayerResponse): string => {
  const message: WebSocketMessage = {
    type: "player",
    player: value,
  };
  return JSON.stringify(message);
};
