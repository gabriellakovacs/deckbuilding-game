import paths from "../paths.js";
import { GameResponse } from "../types.js";
import { gameToUpdateUiInput, throwMissingPropError } from "./helpers.js";
import { isGameResponseType, isGenericResponseType } from "./types.js";
import { updateUI } from "./uiUpdate.js";

type CreateNewUserResponse = {
  game: GameResponse;
  userId: number;
};

const isCreateNewUserResponseType = (
  value: unknown
): value is CreateNewUserResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof value.userId === "number" &&
    "game" in value &&
    isGameResponseType(value.game)
  );
};

export const handleCreateNewUser = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_CREATE_USER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (
      !isGenericResponseType(jsonResponse) ||
      !isCreateNewUserResponseType(jsonResponse.data)
    ) {
      throwMissingPropError({ method, url, jsonResponse, propName: "userId" });
      return;
    }

    window.history.replaceState(
      null,
      null,
      `?userId=${jsonResponse.data?.userId}`
    );
    updateUI(gameToUpdateUiInput(jsonResponse.data.game));
  } catch (error) {
    console.error(error);
  }
};
