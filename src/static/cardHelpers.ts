import {
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
      name: "festival",
      nrOfCards: 20,
    },
    {
      name: "cellar",
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
      return "victoryPoint";
    case "market":
    case "cellar":
    case "festival":
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
    case "laboratorry":
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
