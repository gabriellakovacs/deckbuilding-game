import paths from "../paths.js";
import { GameResponse, PlayerResponse } from "../types.js";
import { gameToUpdateUiInput, throwUnexpectedResponse } from "./helpers.js";
import {
  isGameResponseType,
  isGenericResponseType,
  isPlayerResponseType,
} from "./types.js";
import { updateUI } from "./uiUpdate.js";

type CreateNewPlayerResponse = {
  game: GameResponse;
  playerId: number;
};

const isCreateNewplayerResponseType = (
  value: unknown
): value is CreateNewPlayerResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "playerId" in value &&
    typeof value.playerId === "number" &&
    "game" in value &&
    isGameResponseType(value.game)
  );
};

export const handleCreateNewPlayer = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_CREATE_PLAYER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (
      !isGenericResponseType(jsonResponse) ||
      !isCreateNewplayerResponseType(jsonResponse.data)
    ) {
      throwUnexpectedResponse({
        method,
        url,
        jsonResponse,
      });
      return;
    }

    window.history.replaceState(
      null,
      null,
      `?playerId=${jsonResponse.data?.playerId}`
    );
    updateUI(gameToUpdateUiInput(jsonResponse.data.game));
  } catch (error) {
    console.error(error);
  }
};

export const savePlayerAPI = async (playerObject: PlayerResponse) => {
  const method = "PUT";
  const url = `${paths.BASE_URL}${paths.API_PLAYER}`;

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(playerObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse: unknown = await response.json();
    if (
      !isGenericResponseType(jsonResponse) ||
      !isPlayerResponseType(jsonResponse.data)
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
