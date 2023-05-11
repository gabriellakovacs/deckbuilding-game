export type CardType = "treasure" | "victoryPoint" | "action";
export type TreasureCardNameType = "gold" | "silver" | "copper";
export type ActionCardNameType = "estate" | "duchy" | "province";
export type VictoryPointCardNameType = "market" | "cellar" | "festival";
export type AllCardNames =
  | TreasureCardNameType
  | ActionCardNameType
  | VictoryPointCardNameType;

export type CardInGame = {
  name: AllCardNames;
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
  name: AllCardNames;
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
