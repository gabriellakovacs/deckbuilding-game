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
  userIds: number[];
  currentTurnUserId?: number;
  publicNumber?: number;
  availableCards?: CardListInGame;
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
