export const BASE_URL = "";

export const GAME_DB_PATH = "./database";
export const INDEX_HTML_PATH = "./public/static/fe/index.html";
export const STATIC_FILES_PATH = "./public/static";
export const STATIC_FE_FILES_PATH = "./public/static/fe";

export const API_GAME = "/api/game";
export const API_START_GAME = "/api/game/start";
export const API_END_TURN = `/api/game/end-turn`;
export const API_CREATE_PLAYER = "/api/game/create-player";

export const API_PUBLIC_NUMBER = "/api/public-number";
export const API_PRIVATE_NUMBER = (playerId) =>
  `/api/player/${playerId}/private-number`;
export const API_PRIVATE_NUMBER_REGEX =
  /\/api\/player\/([0-9]+)\/private-number/;

export default {
  BASE_URL,
  GAME_DB_PATH,
  INDEX_HTML_PATH,
  STATIC_FILES_PATH,
  STATIC_FE_FILES_PATH,
  API_GAME,
  API_PUBLIC_NUMBER,
  API_CREATE_PLAYER,
  API_PRIVATE_NUMBER,
  API_PRIVATE_NUMBER_REGEX,
  API_START_GAME,
  API_END_TURN,
};
