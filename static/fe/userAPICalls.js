import paths from "../paths.js";
import { throwMissingPropError, updateUIWithUser } from "./helpers.js";

export const handleCreateNewUser = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_CREATE_USER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse = await response.json();

    if (!jsonResponse?.userId) {
      throwMissingPropError({ method, url, jsonResponse, propName: "userId" });
      return;
    }
    updateUIWithUser();
    window.history.replaceState(null, null, `?userId=${jsonResponse?.userId}`);
  } catch (error) {
    console.error(error);
  }
};
