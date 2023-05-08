type CardInGame = {
  name: string;
  nrOfCards: number;
};

type CardListInGame = {
  treasure: CardInGame[];
  victoryPoint: CardInGame[];
  action: CardInGame[];
};

export type GameResponse = {
  hasStarted: boolean;
  playerIds: number[];
  currentTurnPlayerId?: number;
  publicNumber?: number;
  availableCards?: CardListInGame;
};

type CardInPlayer = {
  name: string;
};

export type PlayerResponse = {
  drawPile: CardInPlayer[];
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
