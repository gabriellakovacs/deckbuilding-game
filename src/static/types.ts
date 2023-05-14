export type CardType = "treasure" | "victoryPoint" | "action";
export type TreasureCardNameType = "copper" | "silver" | "gold";
export type VictoryPointCardNameType =
  | "estate"
  | "duchy"
  | "province"
  | "curse";
export type ActionCardNameType =
  | "cellar"
  | "chapel"
  | "moat"
  | "harbinger"
  | "merchant"
  | "vassal"
  | "village"
  | "workshop"
  | "bureaucrat"
  | "gardens"
  | "militia"
  | "moneylender"
  | "poacher"
  | "remodel"
  | "smithy"
  | "throne room"
  | "bandit"
  | "council room"
  | "festival"
  | "laboratorry"
  | "library"
  | "market"
  | "mine"
  | "sentry"
  | "witch"
  | "artisan";

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
  availableCards?: CardInGame[];
};

export type CardInPlayer = {
  name: AllCardNames;
};

export type TreasureCardWithValue = {
  name: TreasureCardNameType;
  value: number;
};

export type PlayerResponse = {
  id: number;
  drawPile: CardInPlayer[];
  throwPile: CardInPlayer[];
  hand: CardInPlayer[];
  actionRounds: number;
  shoppingRounds: number;
  playedActionCards: CardInPlayer[];
};

export type WebSocketMessage =
  | {
      type: "game";
      game: GameResponse;
    }
  | {
      type: "player";
      player: PlayerResponse;
    };
