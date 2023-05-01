import paths from "../paths.js";
import { throwMissingPropError, updatePublicNumber } from "./helpers.js";

export const getPublicNumber = async () => {
  const method = "GET";
  const url = `${paths.BASE_URL}${paths.API_PUBLIC_NUMBER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse = await response.json();

    if (!jsonResponse?.publicNumber) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "publicNumber",
      });
      return;
    }
    updatePublicNumber(jsonResponse.publicNumber);
  } catch (error) {
    console.error(error);
  }
};

export const handleGeneratePublicNumber = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_PUBLIC_NUMBER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse = await response.json();

    if (!jsonResponse?.publicNumber) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "publicNumber",
      });
      return;
    }
    updatePublicNumber(jsonResponse.publicNumber);
  } catch (error) {
    console.error(error);
  }
};

export const handleUpdatePublicNumber = async () => {
  const method = "PUT";
  const url = `${paths.BASE_URL}${paths.API_PUBLIC_NUMBER}`;
  const publicNumber = new Number(
    document.getElementById("publicNumberInput").value
  );

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify({ publicNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    if (!jsonResponse?.publicNumber) {
      throwMissingPropError({
        method,
        url,
        jsonResponse,
        propName: "publicNumber",
      });
      return;
    }
    updatePublicNumber(jsonResponse.publicNumber);
  } catch (error) {
    console.error(error);
  }
};
