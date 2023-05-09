export type CardInGame = {
  name: string;
  nrOfCards: number;
};

export type GameResponse = {
  hasStarted: boolean;
  playerIds: number[];
  currentTurnPlayerId?: number;
  publicNumber?: number;
  availableCards?: CardInGame[];
};

export type CardInPlayer = {
  name: string;
};

export type PlayerResponse = {
  drawPile: CardInPlayer[];
  throwPile: CardInPlayer[];
  hand: CardInPlayer[];
  privateNumber?: number;
};

export type WebSocketMessage =
  | {
      type: "game";
      game: GameResponse;
    }
  | {
      type: "player";
      player: PlayerResponse;
    }
  | {
      type: "publicNumber";
      publicNumber: number;
    };
