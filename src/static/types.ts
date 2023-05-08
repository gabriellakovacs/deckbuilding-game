export type GameResponse = {
  hasStarted: boolean;
  userIds: number[];
  currentTurnUserId?: number;
  publicNumber?: number;
};

export type WebSocketMessage =
  | {
      type: "game";
      game: GameResponse;
    }
  | {
      type: "player";
      player: {};
    }
  | {
      type: "publicNumber";
      publicNumber: number;
    };
