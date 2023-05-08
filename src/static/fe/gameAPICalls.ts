import paths from "../paths.js";
import { gameToUpdateUiInput, throwMissingPropError } from "./helpers.js";
import { updateUI } from "./uiUpdate.js";

import { isGameResponseType, isGenericResponseType } from "./types.js";
import { GameResponse } from "../types.js";

export const handleStartGame = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_START_GAME}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (
      !isGenericResponseType(jsonResponse) ||
      !isGameResponseType(jsonResponse.data)
    ) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "hasStarted",
      });
      return;
    }
    updateUI(gameToUpdateUiInput(jsonResponse.data));
  } catch (error) {
    console.error(error);
  }
};

export const handleEndOfTurn = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_END_TURN}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (
      !isGenericResponseType(jsonResponse) ||
      !isGameResponseType(jsonResponse.data)
    ) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "success",
      });
      return;
    }
    updateUI(gameToUpdateUiInput(jsonResponse.data));
  } catch (error) {
    console.error(error);
  }
};

export const getGame = async (): Promise<GameResponse> => {
  const method = "GET";
  const url = `${paths.BASE_URL}${paths.API_GAME}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (
      !isGenericResponseType(jsonResponse) ||
      !isGameResponseType(jsonResponse.data)
    ) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "playerIds",
      });
      return;
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(error);
  }
};
