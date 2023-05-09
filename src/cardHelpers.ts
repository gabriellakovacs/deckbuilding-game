import { CardInGame, PlayerResponse } from "./static/types";

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
      name: "action_1",
      nrOfCards: 20,
    },
    {
      name: "action_2",
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
