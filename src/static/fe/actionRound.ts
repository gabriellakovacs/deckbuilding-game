import {
  getCardEffectFromName,
  getCardTypeFromName,
  isActionCardType,
  shuffleArray,
} from "../cardHelpers.js";
import {
  ActionCardNameType,
  AllCardNames,
  CardInPlayer,
  PlayerResponse,
} from "../types.js";
import { savePlayerAPI } from "./playerAPICalls.js";

const hasActionCard = (playerObject: PlayerResponse) => {
  return Boolean(
    playerObject.hand.find(
      (card) => getCardTypeFromName(card.name) === "action"
    )
  );
};

export const actionPossible = (playerObject: PlayerResponse) => {
  return playerObject.actionRounds > 0 && hasActionCard(playerObject);
};

export const handleActionRound = (playerObject: PlayerResponse) => {
  const roundNameSpan = document.getElementById("roundName");
  roundNameSpan.innerHTML = "- action -";
  highlightAndAddEventListenerToActionCardsInHand(playerObject);
};

const getHandArrayFromPlayer = (): Element[] => {
  const handWrap = document.getElementById("hand");

  return Array.from(handWrap.getElementsByClassName("card"));
};

const findIndexOfCard = (array: CardInPlayer[], value: AllCardNames) => {
  return array.findIndex((card) => card.name === value);
};

const moveCardWithinPlayer = (
  cardName: AllCardNames,
  fromArray: CardInPlayer[],
  toArray: CardInPlayer[]
) => {
  const indexOfMoveableCard = findIndexOfCard(fromArray, cardName);
  if (indexOfMoveableCard === -1) {
    return;
  }
  toArray.push(fromArray[indexOfMoveableCard]);
  fromArray.splice(indexOfMoveableCard, 1);
};

const shuffleAndMoveCardsFromThrowPileToDrawPile = (
  playerObject: PlayerResponse
) => {
  const shuffledThrowpile = shuffleArray(playerObject.throwPile);
  playerObject.throwPile = [];
  playerObject.drawPile = [...playerObject.drawPile, ...shuffledThrowpile];
};

const applyActionCardEffect = (
  cardName: ActionCardNameType,
  playerObject: PlayerResponse
): PlayerResponse => {
  const additionalEffect = getCardEffectFromName(cardName);

  if (
    additionalEffect.additionalDraw > 0 &&
    playerObject.drawPile.length < additionalEffect.additionalDraw &&
    playerObject.throwPile.length
  ) {
    shuffleAndMoveCardsFromThrowPileToDrawPile(playerObject);
  }

  return {
    ...playerObject,
    actionRounds: playerObject.actionRounds + additionalEffect.additionalAction,
    shoppingRounds:
      playerObject.shoppingRounds + additionalEffect.additionalShopping,
    additionalTreasure:
      playerObject.additionalTreasure + additionalEffect.additionalTreasure,
    hand: [
      ...playerObject.hand,
      ...playerObject.drawPile.splice(0, additionalEffect.additionalDraw),
    ],
  };
};

const handleSelectActionCard = async (
  playerObject: PlayerResponse,
  cardName: ActionCardNameType
) => {
  moveCardWithinPlayer(
    cardName,
    playerObject.hand,
    playerObject.playedActionCards
  );
  const updatePlayerObject = applyActionCardEffect(cardName, playerObject);
  await savePlayerAPI({
    ...updatePlayerObject,
    actionRounds: updatePlayerObject.actionRounds - 1,
  });
};

const highlightAndAddEventListenerToActionCardsInHand = (
  playerObject: PlayerResponse
) => {
  const actionCardNamesInHand = playerObject.hand
    .map((card) => card.name)
    .filter(isActionCardType);

  const cardElementArrayFromGame = getHandArrayFromPlayer();

  cardElementArrayFromGame
    .filter((cardElement) =>
      actionCardNamesInHand.some(
        (actionCardName) =>
          actionCardName === cardElement.getAttribute("data-name")
      )
    )
    .forEach((cardElement) => {
      cardElement.classList.add("action");
      cardElement.addEventListener("click", () => {
        handleSelectActionCard(
          playerObject,
          cardElement.getAttribute("data-name") as ActionCardNameType
        );
      });
    });
};
