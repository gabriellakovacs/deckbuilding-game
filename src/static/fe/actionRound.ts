import { getCardTypeFromName, isActionCardType } from "../cardHelpers.js";
import { AllCardNames, CardInPlayer, PlayerResponse } from "../types.js";
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

const handleSelectActionCard = async (
  playerObject: PlayerResponse,
  cardName: AllCardNames
) => {
  moveCardWithinPlayer(
    cardName,
    playerObject.hand,
    playerObject.playedActionCards
  );
  await savePlayerAPI({
    ...playerObject,
    actionRounds: playerObject.actionRounds - 1,
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
          cardElement.getAttribute("data-name") as AllCardNames
        );
      });
    });
};
