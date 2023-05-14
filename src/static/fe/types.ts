import { GameResponse, PlayerResponse } from "../types";

export const isGameResponseType = (value: unknown): value is GameResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "hasStarted" in value &&
    typeof value.hasStarted === "boolean" &&
    "playerIds" in value &&
    Array.isArray(value.playerIds)
  );
};

export const isPlayerResponseType = (
  value: unknown
): value is PlayerResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "throwPile" in value &&
    Array.isArray(value.throwPile) &&
    value.throwPile.reduce(
      (acc, card) => acc && isCardInPlayerType(card),
      true
    ) &&
    "drawPile" in value &&
    Array.isArray(value.drawPile) &&
    value.drawPile.reduce(
      (acc, card) => acc && isCardInPlayerType(card),
      true
    ) &&
    "hand" in value &&
    Array.isArray(value.hand) &&
    value.hand.reduce((acc, card) => acc && isCardInPlayerType(card), true) &&
    "actionRounds" in value &&
    typeof value.actionRounds === "number" &&
    "shoppingRounds" in value &&
    typeof value.shoppingRounds === "number" &&
    "id" in value &&
    typeof value.id === "number"
  );
};

export const isCardInPlayerType = (value: unknown): value is PlayerResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
};

export type GenericResponse = {
  success: boolean;
  data?: object;
};

export const isGenericResponseType = (
  value: unknown
): value is GenericResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean"
  );
};
