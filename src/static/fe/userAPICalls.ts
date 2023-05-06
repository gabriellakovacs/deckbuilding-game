import paths from "../paths.js";
import { throwMissingPropError, updateUIWithUser } from "./helpers.js";

type CreateNewUserResponse = {
  userId: number;
};

const isCreateNewUserResponseType = (
  value: unknown
): value is CreateNewUserResponse => {
  return typeof value === "object" && value !== null && "userId" in value;
};

export const handleCreateNewUser = async () => {
  const method = "POST";
  const url = `${paths.BASE_URL}${paths.API_CREATE_USER}`;

  try {
    const response = await fetch(url, { method });
    const jsonResponse: unknown = await response.json();

    if (!isCreateNewUserResponseType(jsonResponse)) {
      throwMissingPropError({ method, url, jsonResponse, propName: "userId" });
      return;
    }
    updateUIWithUser();
    window.history.replaceState(null, null, `?userId=${jsonResponse?.userId}`);
  } catch (error) {
    console.error(error);
  }
};
