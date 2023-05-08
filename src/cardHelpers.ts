import { PlayerResponse } from "./static/types";

export const getOriginalAvailableCards = () => {
  return {
    treasure: [
      {
        name: "gold",
        nrOfCards: 12,
      },
      {
        name: "copper",
        nrOfCards: 12,
      },
      {
        name: "silver",
        nrOfCards: 12,
      },
    ],
    victoryPoint: [
      {
        name: "low",
        nrOfCards: 12,
      },
      {
        name: "medium",
        nrOfCards: 12,
      },
      {
        name: "high",
        nrOfCards: 12,
      },
    ],
    action: [
      {
        name: "action_1",
        nrOfCards: 12,
      },
      {
        name: "action_2",
        nrOfCards: 12,
      },
    ],
  };
};

export const getInitialDrawPile = (): PlayerResponse => {
  return {
    drawPile: shuffleArray([
      { name: "copper" },
      { name: "copper" },
      { name: "copper" },
      { name: "copper" },
      { name: "copper" },
      { name: "copper" },
      { name: "copper" },
      { name: "estate" },
      { name: "estate" },
      { name: "estate" },
    ]),
  };
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
