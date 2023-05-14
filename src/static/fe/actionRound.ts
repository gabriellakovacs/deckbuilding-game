import { getCardTypeFromName } from "../cardHelpers.js";
import { PlayerResponse } from "../types.js";

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
