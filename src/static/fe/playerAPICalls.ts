import paths from "../paths.js";
import { GameResponse } from "../types.js";
import { gameToUpdateUiInput, throwMissingPropError } from "./helpers.js";
import { isGameResponseType, isGenericResponseType } from "./types.js";
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
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "playerId",
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
