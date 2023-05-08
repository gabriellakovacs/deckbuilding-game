import { GameResponse, WebSocketMessage } from "./static/types";

export const createWebSocketMessage = (value: GameResponse): string => {
  const message: WebSocketMessage = {
    type: "game",
    game: value,
  };
  return JSON.stringify(message);
};
