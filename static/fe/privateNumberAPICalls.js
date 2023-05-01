import paths from "../paths.js";
import {
  throwMissingPropError,
  updatePrivateNumber,
  getUserIdFromCurrentUrl,
} from "./helpers.js";

export const getPrivateNumber = async (userId) => {
  const method = "GET";
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(userId)}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse = await response.json();

    if (!jsonResponse?.privateNumber) {
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
  const userId = getUserIdFromCurrentUrl();
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(userId)}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse = await response.json();

    if (!jsonResponse?.privateNumber) {
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
  const userId = getUserIdFromCurrentUrl();
  const url = `${paths.BASE_URL}${paths.API_PRIVATE_NUMBER(userId)}`;
  const privateNumber = new Number(
    document.getElementById("privateNumberInput").value
  );

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify({ privateNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await response.json();

    if (!jsonResponse?.privateNumber) {
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
