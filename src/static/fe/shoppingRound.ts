import {
  getCardPriceFromName,
  getCardValueFromName,
  isTreasureCardType,
} from "../cardHelpers.js";
import {
  AllCardNames,
  CardInPlayer,
  GameResponse,
  PlayerResponse,
  TreasureCardWithValue,
} from "../types.js";
import { saveGame } from "./gameAPICalls.js";
import { savePlayerAPI } from "./playerAPICalls.js";

type updateUIFunction = (
  gameObject: GameResponse,
  playerObject: PlayerResponse
) => void;

const getSortedTreasureCardsWithValue = (
  cards: CardInPlayer[]
): TreasureCardWithValue[] => {
  return cards
    .map((card) => card.name)
    .filter(isTreasureCardType)
    .map((cardName) => {
      return {
        name: cardName,
        value: getCardValueFromName(cardName),
      };
    })
    .sort((card1, card2) => card2.value - card1.value);
};

const fromTreasureCardWithValueToCardInPlayer = (
  card: TreasureCardWithValue
): CardInPlayer => {
  return { name: card.name };
};

const moveFromHandToThrowPile = (
  throwPileAddition: CardInPlayer[],
  remainderOfTreasureCardsInHand: CardInPlayer[],
  playerObject: PlayerResponse
): PlayerResponse => {
  return {
    ...playerObject,
    hand: [
      ...remainderOfTreasureCardsInHand,
      ...playerObject.hand.filter((card) => !isTreasureCardType(card.name)),
    ],
    throwPile: [...playerObject.throwPile, ...throwPileAddition],
  };
};

const findIndexOfCardWithValue = (
  array: TreasureCardWithValue[],
  value: number
) => {
  return array.findIndex((card) => card.value === value);
};

const moveCardWithValue = (
  cardValue: number,
  fromArray: TreasureCardWithValue[],
  toArray: TreasureCardWithValue[]
) => {
  const indexOfCardWithValue3 = findIndexOfCardWithValue(fromArray, cardValue);
  if (indexOfCardWithValue3 === -1) {
    return;
  }
  toArray.push(fromArray[indexOfCardWithValue3]);
  fromArray.splice(indexOfCardWithValue3, 1);
};

const moveTreasureCardsToThrowPileAsPay = (
  price: number,
  playerObject: PlayerResponse
) => {
  if (price === 0) {
    return playerObject;
  }
  const sortedTreasureCardsWithValueInHand = getSortedTreasureCardsWithValue(
    playerObject.hand
  );

  let accumulatedCardValueForPayment = 0;
  const accumulatedCardsForPayment: TreasureCardWithValue[] = [];

  while (accumulatedCardValueForPayment < price) {
    const currentTreasureCard = sortedTreasureCardsWithValueInHand.pop();
    accumulatedCardsForPayment.push(currentTreasureCard);
    accumulatedCardValueForPayment += currentTreasureCard.value;
  }

  if (accumulatedCardValueForPayment > price) {
    const difference = accumulatedCardValueForPayment - price;

    if (
      accumulatedCardsForPayment.filter((card) => card.value === difference)
        .length >= 1
    ) {
      moveCardWithValue(
        difference,
        accumulatedCardsForPayment,
        sortedTreasureCardsWithValueInHand
      );
    } else {
      if (
        difference === 1 &&
        accumulatedCardsForPayment.filter((card) => card.value === 2).length >=
          2 &&
        sortedTreasureCardsWithValueInHand.includes({ name: "gold", value: 3 })
      ) {
        // Put 2 treasure cards with value 2 from accumulationArray back to sortedTreasureCardsWithValue
        for (let i = 0; i < 2; i++) {
          moveCardWithValue(
            2,
            accumulatedCardsForPayment,
            sortedTreasureCardsWithValueInHand
          );
        }
        // add 1 card with value 3 to accumulationArray and remove from sortedTreasureCardsWithValue
        moveCardWithValue(
          3,
          sortedTreasureCardsWithValueInHand,
          accumulatedCardsForPayment
        );
      }
      if (
        difference === 2 &&
        accumulatedCardsForPayment.filter((card) => card.value === 1).length >=
          1
      ) {
        // Put 2 treasure cards with value 1 from accumulationArray back to sortedTreasureCardsWithValue
        for (let i = 0; i < 2; i++) {
          moveCardWithValue(
            1,
            accumulatedCardsForPayment,
            sortedTreasureCardsWithValueInHand
          );
        }
      }
    }
  }

  return moveFromHandToThrowPile(
    accumulatedCardsForPayment.map((card) =>
      fromTreasureCardWithValueToCardInPlayer(card)
    ),
    sortedTreasureCardsWithValueInHand.map((card) =>
      fromTreasureCardWithValueToCardInPlayer(card)
    ),
    playerObject
  );
};

const buyCard = (
  cardName: AllCardNames,
  gameObject: GameResponse,
  playerObject: PlayerResponse
) => {
  const { changedGameObject, changedPlayerObject } = moveCardFromGameToPlayer(
    cardName,
    gameObject,
    playerObject
  );

  const playerObjectUpdated = moveTreasureCardsToThrowPileAsPay(
    getCardPriceFromName(cardName),
    changedPlayerObject
  );
  return {
    playerObject: {
      ...playerObjectUpdated,
      shoppingRounds: playerObjectUpdated.shoppingRounds - 1,
    },
    gameObject: changedGameObject,
  };
};

const moveCardFromGameToPlayer = (
  cardName: AllCardNames,
  gameObject: GameResponse,
  playerObject: PlayerResponse
) => {
  const availableCards = gameObject.availableCards.map((card) => {
    return card.name === cardName
      ? { ...card, nrOfCards: card.nrOfCards - 1 }
      : card;
  });
  playerObject.throwPile.push({ name: cardName });
  return {
    changedGameObject: { ...gameObject, availableCards },
    changedPlayerObject: playerObject,
  };
};

const shoppingPossible = (playerObject: PlayerResponse) => {
  // as copper is free, the player only needs shopping round to be able to shop
  return playerObject.shoppingRounds > 0;
};

const getBudget = (playerObject: PlayerResponse) => {
  // TODO: player can also have treasure from previously played action cards
  return playerObject.hand.reduce((acc, card) => {
    return isTreasureCardType(card.name)
      ? acc + getCardValueFromName(card.name)
      : acc;
  }, 0);
};

const getCardElementArrayFromGame = (): Element[] => {
  const treasureCardsWrap = document.getElementById("treasureCards");
  const victoryPointCardsWrap = document.getElementById("victoryPointCards");
  const actionCardsWrap = document.getElementById("actionCards");

  const cardCollection: Element[][] = [];
  [treasureCardsWrap, victoryPointCardsWrap, actionCardsWrap].forEach(
    (cardTypeHtmlWrap) => {
      const arrayOfCardElements = Array.from(
        cardTypeHtmlWrap.getElementsByClassName("card")
      );
      cardCollection.push(arrayOfCardElements);
    }
  );

  return cardCollection.flat();
};

const highlightAndAddEventListenerToCardsWithinBudget = (
  playerObject: PlayerResponse,
  gameObject: GameResponse,
  updateUI: updateUIFunction
) => {
  const budget = getBudget(playerObject);
  const cardNamesWithinBudget = gameObject.availableCards
    .filter((card) => getCardPriceFromName(card.name) <= budget)
    .map((card) => card.name);

  const cardElementArrayFromGame = getCardElementArrayFromGame();

  cardElementArrayFromGame
    .filter((element) => {
      const name = element.getAttribute("data-name");
      return cardNamesWithinBudget.some(
        (cardNameWithinBudget) => cardNameWithinBudget === name
      );
    })
    .forEach((element) => {
      element.classList.add("buyme");
      element.addEventListener("click", async () => {
        const {
          playerObject: changedPlayerObject,
          gameObject: changedGameObject,
        } = buyCard(
          element.getAttribute("data-name") as AllCardNames,
          gameObject,
          playerObject
        );
        // updateUI(changedGameObject, changedPlayerObject);

        await saveGame(changedGameObject);
        await savePlayerAPI(changedPlayerObject);
      });
    });
};

export const handleShoppingRound = (
  playerObject: PlayerResponse,
  gameObject: GameResponse,
  updateUI: updateUIFunction
) => {
  const roundNameSpan = document.getElementById("roundName");
  if (shoppingPossible(playerObject) && gameObject) {
    roundNameSpan.innerHTML = "- shopping -";
    highlightAndAddEventListenerToCardsWithinBudget(
      playerObject,
      gameObject,
      updateUI
    );
  } else {
    roundNameSpan.innerHTML = "- end of turn -";
  }
};
