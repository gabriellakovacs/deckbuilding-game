import { getUserIdFromCurrentUrl, updateUIWithUser } from "./helpers.js";
import {
  getPublicNumber,
  handleGeneratePublicNumber,
  handleUpdatePublicNumber,
} from "./publicNumberAPICalls.js";
import {
  getPrivateNumber,
  handleGeneratePrivateNumber,
  handleUpdatePrivateNumber,
} from "./privateNumberAPICalls.js";
import { handleCreateNewUser } from "./userAPICalls.js";

export const checkForExistingUserIdAndGeneratedNumbers = async () => {
  const userId = Number(getUserIdFromCurrentUrl());

  if (userId) {
    updateUIWithUser();
    await getPrivateNumber(userId);
  }

  await getPublicNumber();
};

checkForExistingUserIdAndGeneratedNumbers();

document
  .querySelector("#generatePublicNumberButton")
  .addEventListener("click", handleGeneratePublicNumber);
document
  .querySelector("#updatePublicNumberButton")
  .addEventListener("click", handleUpdatePublicNumber);
document
  .querySelector("#createUserButton")
  .addEventListener("click", handleCreateNewUser);
document
  .querySelector("#generatePrivateNumberButton")
  .addEventListener("click", handleGeneratePrivateNumber);
document
  .querySelector("#updatePrivateNumberButton")
  .addEventListener("click", handleUpdatePrivateNumber);
