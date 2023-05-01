import userModel from "../models/userModel.js";
import { getReqData } from "../utils.js";

const headerContentJson = {
  "Content-Type": "application/json",
};

const createUser = async (req, res) => {
  //TODO: max 4 users for now?
  const userId = await userModel.createNewUserFile();

  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ userId }));
};

const getPrivateNumber = (req, res) => {
  const userId = req.url.split("/")[3];
  // TODO: check if this id exists
  const privateNumber = userModel.getPrivateNumberFromUser(userId);
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const createNewPrivateNumber = (req, res) => {
  const userId = req.url.split("/")[3];
  // TODO: check if this id exists
  const privateNumber = Math.round(Math.random() * 100);
  userModel.savePrivateNumberInUser({ privateNumber, userId });
  res.writeHead(200, headerContentJson);
  res.end(JSON.stringify({ privateNumber }));
};

const updatePrivateNumber = async (req, res) => {
  const userId = req.url.split("/")[3];
  // TODO: check if this id exists
  const data = await getReqData(req);
  const privateNumber = JSON.parse(data)?.privateNumber;

  if (typeof privateNumber === "number") {
    userModel.savePrivateNumberInUser({ userId, privateNumber });
    res.writeHead(200, headerContentJson);
    res.end(JSON.stringify({ success: true, privateNumber }));
    return;
  }

  res.writeHead(200, headerContentJson);
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
