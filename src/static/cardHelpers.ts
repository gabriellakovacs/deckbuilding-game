import { AllCardNames, CardInGame, CardInPlayer, CardType } from "./types";

export const getInitialDeckForGame = (): Array<CardInGame> => {
  return [
    {
      name: "gold",
      nrOfCards: 20,
    },
    {
      name: "copper",
      nrOfCards: 20,
    },
    {
      name: "silver",
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
