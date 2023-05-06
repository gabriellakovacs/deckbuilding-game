import userModel from "../models/userModel.js";
import { getCurrentUserIds } from "../models/gameModel.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const isValidUserId = (userId: unknown) => {
  if (typeof userId !== "number") {
    return false;
  }
  const existingUserIds = getCurrentUserIds();
  return existingUserIds.includes(userId);
};

const resWrongUserID = (res, userId) => {
  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Id: ${userId} does not exist`,
    })
  );
};

const createUser = async (req, res) => {
  //TODO: max 4 users for now?
  const userId = await userModel.createNewUserFile();

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ userId }));
};

const getPrivateNumber = (req, res) => {
  const userId = req.url.split("/")[3];

  if (!isValidUserId(userId)) {
    resWrongUserID(res, userId);
    return;
  }
  const privateNumber = userModel.getPrivateNumberFromUser(userId);
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const createNewPrivateNumber = (req, res) => {
  const userId = req.url.split("/")[3];

  if (!isValidUserId(userId)) {
    resWrongUserID(res, userId);
    return;
  }
  const privateNumber = Math.round(Math.random() * 100);
  userModel.savePrivateNumberInUser({ privateNumber, userId });
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const updatePrivateNumber = async (req, res) => {
  const userId = req.url.split("/")[3];

  if (!isValidUserId(userId)) {
    resWrongUserID(res, userId);
    return;
  }
  const data = await getReqData(req);
  if (typeof data !== "string") {
    throw new Error(
      `Invalid data type: ${typeof data} for updatePrivateNumber`
    );
  }
  const privateNumber = JSON.parse(data)?.privateNumber;

  if (typeof privateNumber === "number") {
    userModel.savePrivateNumberInUser({ userId, privateNumber });
    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, privateNumber }));
    return;
  }

  res.writeHead(400, headerContentJson);
  res.end(
    JSON.stringify({
      success: false,
      message: `Expected a number, but got: ${typeof privateNumber}: ${privateNumber}`,
    })
  );
};

export default {
  createUser,
  getPrivateNumber,
  createNewPrivateNumber,
  updatePrivateNumber,
};
