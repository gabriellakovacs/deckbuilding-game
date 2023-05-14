import paths from "../paths.js";
import { gameToUpdateUiInput, throwUnexpectedResponse } from "./helpers.js";
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
      throwUnexpectedResponse({
        method,
        url,
        jsonResponse,
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
      throwUnexpectedResponse({
        method,
        url,
        jsonResponse,
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
      throwUnexpectedResponse({
        method,
        url,
        jsonResponse,
      });
      return;
    }
    return jsonResponse.data;
  } catch (error) {
    console.error(error);
  }
};

export const saveGame = async (gameObject: GameResponse) => {
  const method = "PUT";
  const url = `${paths.BASE_URL}${paths.API_GAME}`;

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(gameObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse: unknown = await response.json();
    if (
      !isGenericResponseType(jsonResponse) ||
      !isGameResponseType(jsonResponse.data)
    ) {
      throwUnexpectedResponse({
        method,
        url,
        jsonResponse,
      });
      return;
    }

    // UI update is made after websocket message. Figure out a better way to handle this
  } catch (error) {
    console.error(error);
  }
};
