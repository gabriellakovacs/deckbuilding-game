import {
  CardInGame,
  CardInPlayer,
  GameResponse,
  PlayerResponse,
} from "../types.js";
import { getCardPriceFromName, getCardTypeFromName } from "./../cardHelpers.js";
import { actionPossible, handleActionRound } from "./actionRound.js";
import { handleShoppingRound } from "./shoppingRound.js";

const MIN_NUMBER_OF_PLAYERS_FOR_GAME = 2;

// ENTRY ROOM
const updateUiEntryRoom = (hasGameStarted) => {
  document.getElementById("waitingRoom").style.display = "none";
  document.getElementById("gameRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "block";

  if (hasGameStarted) {
    updateUIWaitForGametoEnd();
  } else {
    updateUICreatePlayer();
  }
};

const updateUIWaitForGametoEnd = () => {
  document.getElementById("createPlayerButton").style.display = "none";
  document.getElementById("waitingForGameToEnd").style.display = "block";
};

const updateUICreatePlayer = () => {
  document.getElementById("createPlayerButton").style.display = "block";
  document.getElementById("waitingForGameToEnd").style.display = "none";
};

// WAITING ROOM
const updateUiWaitingRoom = (numberOfPlayers) => {
  document.getElementById("waitingRoom").style.display = "block";
  document.getElementById("gameRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "none";

  updateUINumberOfPlayers(numberOfPlayers);

  if (numberOfPlayers >= MIN_NUMBER_OF_PLAYERS_FOR_GAME) {
    updateUIWithStartGame();
  } else {
    updateUIWaitForMorePlayers();
  }
};

const updateUINumberOfPlayers = (numberOfPlayers) => {
  document.getElementById("numberOfPlayers").innerHTML = numberOfPlayers;
};

const updateUIWithStartGame = () => {
  document.getElementById("startGameButton").style.display = "block";
  document.getElementById("waitingForMorePlayers").style.display = "none";
};

const updateUIWaitForMorePlayers = () => {
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("waitingForMorePlayers").style.display = "block";
};

// GAME ROOM
const updateUIWithGameStart = (isPlayersTurn: boolean) => {
  document.getElementById("waitingRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "none";
  document.getElementById("gameRoom").style.display = "block";
  updateUITurn(isPlayersTurn);
};

const updateUITurn = (isPlayersTurn: boolean) => {
  if (isPlayersTurn) {
    document.getElementById("notPlayersTurn").style.display = "none";
    document.getElementById("playersTurn").style.display = "block";
    return;
  }
  document.getElementById("notPlayersTurn").style.display = "block";
  document.getElementById("playersTurn").style.display = "none";
};

export const updateUI = ({
  hasGameStarted,
  isItYourTurn,
  playerId,
  numberOfPlayers,
}: {
  hasGameStarted: boolean;
  isItYourTurn: boolean;
  numberOfPlayers: number;
  playerId?: number;
}) => {
  if (playerId && hasGameStarted) {
    updateUIWithGameStart(isItYourTurn);
  } else if (playerId && !hasGameStarted) {
    updateUiWaitingRoom(numberOfPlayers);
  } else if (!playerId) {
    updateUiEntryRoom(hasGameStarted);
  }
};

const createCardUI = (card: CardInPlayer | CardInGame) => {
  const price = getCardPriceFromName(card.name);
  const cardElement = document.createElement("div");
  cardElement.className = "card";
  if ("nrOfCards" in card && card.nrOfCards === 0) {
    cardElement.classList.add("soldOut");
  }
  cardElement.setAttribute("data-name", card.name);
  const cardName = document.createElement("p");
  cardName.innerHTML = card.name;
  const cardPrice = document.createElement("span");
  cardPrice.className = "cardPrice";
  cardPrice.innerHTML = String(price);
  cardElement.appendChild(cardName);
  cardElement.appendChild(cardPrice);
  return cardElement;
};

// PLAYERS TURN
export const updatePlayersTurnUI = (
  playerObject: PlayerResponse,
  game?: GameResponse
) => {
  const hand = document.getElementById("hand");
  const drawPile = document.getElementById("drawPile");
  const throwPile = document.getElementById("throwPile");
  const playedActionCards = document.getElementById("playedActionCards");

  hand.innerHTML = "";
  playerObject.hand.forEach((card) => {
    const cardElement = createCardUI(card);
    hand.appendChild(cardElement);
  });

  drawPile.innerHTML = "";
  const drawPileInner = document.createElement("div");
  drawPileInner.innerHTML = String(playerObject.drawPile.length);
  drawPile.appendChild(drawPileInner);

  throwPile.innerHTML = "";
  const throwwPileInner = document.createElement("div");
  throwwPileInner.innerHTML = String(playerObject.throwPile.length);
  throwPile.appendChild(throwwPileInner);

  playedActionCards.innerHTML = "";
  playerObject.playedActionCards.forEach((card) => {
    const cardElement = createCardUI(card);
    playedActionCards.appendChild(cardElement);
  });

  if (game.currentTurnPlayerId === playerObject.id) {
    if (actionPossible(playerObject)) {
      handleActionRound(playerObject);
      return null;
    }

    handleShoppingRound(playerObject, game, (gameObject, playerObject) => {
      updateGameAvailableCardsUI(gameObject);
      updatePlayersTurnUI(playerObject, gameObject);
    });
  }
};

// GAME CARDS
export const updateGameAvailableCardsUI = (gameObject: GameResponse) => {
  const componentDiv = document.getElementById("gameAvailableCards");
  const treasureCards = document.getElementById("treasureCards");
  const victoryPointCards = document.getElementById("victoryPointCards");
  const actionCards = document.getElementById("actionCards");

  treasureCards.innerHTML = "";
  victoryPointCards.innerHTML = "";
  actionCards.innerHTML = "";

  gameObject.availableCards?.forEach((card) => {
    const cardElement = createCardUI(card);

    switch (getCardTypeFromName(card.name)) {
      case "action":
        actionCards.appendChild(cardElement);
        break;
      case "treasure":
        treasureCards.appendChild(cardElement);
        break;
      case "victoryPoint":
        victoryPointCards.appendChild(cardElement);
        break;
      default:
        throw `Unexpected value ${getCardTypeFromName(
          card.name
        )} for getCardTypeFromName`;
    }
  });
};
