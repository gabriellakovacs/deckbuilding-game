import paths from "../paths.js";
import { throwMissingPropError, updatePublicNumber } from "./helpers.js";

type PublicNumberResponse = {
  publicNumber: number;
};

const isPublicNumberResponseType = (
  value: unknown
): value is PublicNumberResponse => {
  return typeof value === "object" && value !== null && "publicNumber" in value;
};

export const getPublicNumber = async () => {
  const method = "GET";
  const url = `${paths.BASE_URL}${paths.API_PUBLIC_NUMBER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (!isPublicNumberResponseType(jsonResponse)) {
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
    const jsonResponse: unknown = await response.json();

    if (!isPublicNumberResponseType(jsonResponse)) {
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
  const publicNumberInput = document.getElementById(
    "publicNumberInput"
  ) as HTMLInputElement;
  const publicNumber = new Number(publicNumberInput.value);

  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify({ publicNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse: unknown = await response.json();

    if (!isPublicNumberResponseType(jsonResponse)) {
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
