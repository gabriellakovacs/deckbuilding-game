import paths from "../paths.js";
import {
  throwMissingPropError,
  updatePrivateNumber,
  getPlayerIdFromCurrentUrl,
} from "./helpers.js";

type PrivateNumberResponse = {
  privateNumber: number;
};

const isPrivateNumberResponseType = (
  value: unknown
): value is PrivateNumberResponse => {
  return (
    typeof value === "object" && value !== null && "privateNumber" in value
  );
};

export const getPrivateNumber = async (playerId: number) => {
  const method = "GET";
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(playerId)}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (!isPrivateNumberResponseType(jsonResponse)) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "privateNumber",
      });
      return;
    }
    updatePrivateNumber(jsonResponse.privateNumber);
  } catch (error) {
    console.error(error);
  }
};

export const handleGeneratePrivateNumber = async () => {
  const method = "POST";
  const playerId = getPlayerIdFromCurrentUrl();
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(playerId)}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (!isPrivateNumberResponseType(jsonResponse)) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "privateNumber",
      });
      return;
    }
    updatePrivateNumber(jsonResponse.privateNumber);
  } catch (error) {
    console.error(error);
  }
};

export const handleUpdatePrivateNumber = async () => {
  const method = "PUT";
  const playerId = getPlayerIdFromCurrentUrl();
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(playerId)}`;
  const privateNumberInput = document.getElementById(
    "privateNumberInput"
  ) as HTMLInputElement;
  const privateNumber = new Number(privateNumberInput.value);

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify({ privateNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse: unknown = await response.json();

    if (!isPrivateNumberResponseType(jsonResponse)) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "privateNumber",
      });
      return;
    }
    updatePrivateNumber(jsonResponse.privateNumber);
  } catch (error) {
    console.error(error);
  }
};
