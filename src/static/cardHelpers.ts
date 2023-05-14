import {
  ActionCardNameType,
  AllCardNames,
  CardInGame,
  CardInPlayer,
  CardType,
  TreasureCardNameType,
} from "./types";

export const getInitialDeckForGame = (): Array<CardInGame> => {
  return [
    {
      name: "copper",
      nrOfCards: 20,
    },
    {
      name: "silver",
      nrOfCards: 20,
    },
    {
      name: "gold",
      nrOfCards: 20,
    },
    {
      name: "estate",
      nrOfCards: 20,
    },
    {
      name: "duchy",
      nrOfCards: 20,
    },
    {
      name: "province",
      nrOfCards: 20,
    },
    {
      name: "curse",
      nrOfCards: 20,
    },
    {
      name: "festival",
      nrOfCards: 20,
    },
    {
      name: "cellar",
      nrOfCards: 20,
    },
    {
      name: "market",
      nrOfCards: 20,
    },
    {
      name: "smithy",
      nrOfCards: 20,
    },
    {
      name: "village",
      nrOfCards: 20,
    },
    {
      name: "workshop",
      nrOfCards: 20,
    },
  ];
};

export const getInitialDeckForPlayer = (): Array<CardInGame> => {
  return [
    { name: "copper", nrOfCards: 7 },
    { name: "estate", nrOfCards: 3 },
  ];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const arrayCopy = array.slice(0);
  for (var i = arrayCopy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arrayCopy[i];
    arrayCopy[i] = arrayCopy[j];
    arrayCopy[j] = temp;
  }
  return arrayCopy;
};

export const getCardTypeFromName = (name: AllCardNames): CardType => {
  switch (name) {
    case "gold":
    case "silver":
    case "copper":
      return "treasure";
    case "estate":
    case "duchy":
    case "province":
    case "curse":
      return "victoryPoint";
    case "market":
    case "cellar":
    case "festival":
    case "chapel":
    case "moat":
    case "harbinger":
    case "merchant":
    case "vassal":
    case "village":
    case "workshop":
    case "bureaucrat":
    case "gardens":
    case "militia":
    case "moneylender":
    case "poacher":
    case "remodel":
    case "smithy":
    case "throne room":
    case "bandit":
    case "laboratory":
    case "library":
    case "mine":
    case "sentry":
    case "witch":
    case "duchy":
    case "council room":
    case "artisan":
      return "action";
    default:
      console.error(`Invalid card name: ${name}`);
  }
};

export const isTreasureCardType = (
  value: string | undefined
): value is TreasureCardNameType => {
  return ["gold", "silver", "copper"].includes(value);
};

export const isActionCardType = (
  value: string | undefined
): value is ActionCardNameType => {
  return [
    "market",
    "cellar",
    "festival",
    "chapel",
    "moat",
    "harbinger",
    "merchant",
    "vassal",
    "village",
    "workshop",
    "bureaucrat",
    "gardens",
    "militia",
    "moneylender",
    "poacher",
    "remodel",
    "smithy",
    "throne room",
    "mine",
    "duchy",
    "bandit",
    "council room",
    "laboratory",
    "library",
    "sentry",
    "witch",
    "artisan",
  ].includes(value);
};

export const getCardPriceFromName = (name: AllCardNames): number => {
  switch (name) {
    case "copper":
    case "curse":
      return 0;
    case "estate":
    case "cellar":
    case "chapel":
    case "moat":
      return 2;
    case "silver":
    case "harbinger":
    case "merchant":
    case "vassal":
    case "village":
    case "workshop":
      return 3;
    case "bureaucrat":
    case "gardens":
    case "militia":
    case "moneylender":
    case "poacher":
    case "remodel":
    case "smithy":
    case "throne room":
      return 4;
    case "duchy":
    case "festival":
    case "bandit":
    case "council room":
    case "laboratory":
    case "library":
    case "market":
    case "mine":
    case "sentry":
    case "witch":
      return 5;
    case "gold":
    case "artisan":
      return 6;
    case "province":
      return 8;

    default:
      console.error(`Invalid card name: ${name}`);
  }
};

export const getCardValueFromName = (name: TreasureCardNameType) => {
  switch (name) {
    case "gold":
      return 3;
    case "silver":
      return 2;
    case "copper":
      return 1;
    default:
      console.error(`Invalid treasure card name: ${name}`);
  }
};

export const getCardEffectFromName = (name: ActionCardNameType) => {
  switch (name) {
    case "market":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "cellar":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "festival":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "chapel":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "moat":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "harbinger":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "merchant":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "vassal":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "village":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "workshop":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "bureaucrat":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "gardens":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "militia":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "moneylender":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "poacher":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "remodel":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "smithy":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "throne room":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "bandit":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "laboratory":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "library":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "mine":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "sentry":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "witch":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "duchy":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "council room":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    case "artisan":
      return {
        additionalDraw: 1,
        additionalShopping: 1,
        additionalAction: 1,
        additionalTreasure: 1,
      };
    default:
      throw `Invalid action name: ${name}`;
  }
};

export const cardInGameToCardInPlayer = (
  cards: Array<CardInGame>
): Array<CardInPlayer> => {
  const cardsInPlayer = [];
  cards.forEach((card) => {
    for (let i = 0; i < card.nrOfCards; i++) {
      cardsInPlayer.push({ name: card.name });
    }
  });
  return cardsInPlayer;
};

export const organizeCardsInHand = (
  cards: Array<CardInPlayer>
): Array<CardInPlayer> => {
  const actionCards = cards.filter(
    (card) => getCardTypeFromName(card.name) === "action"
  );
  const treasureCards = cards.filter(
    (card) => getCardTypeFromName(card.name) === "treasure"
  );
  const victoryPointCards = cards.filter(
    (card) => getCardTypeFromName(card.name) === "victoryPoint"
  );
  return [...actionCards, ...treasureCards, ...victoryPointCards];
};
