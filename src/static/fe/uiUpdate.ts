const MIN_NUMBER_OF_PLAYERS_FOR_GAME = 2;

// ENTRY ROOM
const updateUiEntryRoom = (hasGameStarted) => {
  document.getElementById("waitingRoom").style.display = "none";
  document.getElementById("gameRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "block";

  if (hasGameStarted) {
    updateUIWaitForGametoEnd();
  } else {
    updateUICreateUser();
  }
};

const updateUIWaitForGametoEnd = () => {
  document.getElementById("createUserButton").style.display = "none";
  document.getElementById("waitingForGameToEnd").style.display = "block";
};

const updateUICreateUser = () => {
  document.getElementById("createUserButton").style.display = "block";
  document.getElementById("waitingForGameToEnd").style.display = "none";
};

// WAITING ROOM
const updateUiWaitingRoom = (numberOfPlayers) => {
  document.getElementById("waitingRoom").style.display = "block";
  document.getElementById("gameRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "none";

  updateUINumberOfUsers(numberOfPlayers);

  if (numberOfPlayers >= MIN_NUMBER_OF_PLAYERS_FOR_GAME) {
    updateUIWithStartGame();
  } else {
    updateUIWaitForMorePlayers();
  }
};

const updateUINumberOfUsers = (numberOfPlayers) => {
  document.getElementById("numberOfPlayers").innerHTML = numberOfPlayers;
};

const updateUIWithStartGame = () => {
  document.getElementById("startGameButton").style.display = "block";
  document.getElementById("waitingForMorePlayers").style.display = "none";
};

const updateUIWaitForMorePlayers = () => {
  document.getElementById("startGameButton").style.display = "none";
  document.getElementById("waitingForMorePlayers").style.display = "block";
};

// GAME ROOM
const updateUIWithGameStart = (isUsersTurn: boolean) => {
  document.getElementById("waitingRoom").style.display = "none";
  document.getElementById("entryRoom").style.display = "none";
  document.getElementById("gameRoom").style.display = "block";
  updateUITurn(isUsersTurn);
};

const updateUITurn = (isUsersTurn: boolean) => {
  if (isUsersTurn) {
    document.getElementById("notUsersTurn").style.display = "none";
    document.getElementById("usersTurn").style.display = "block";
    return;
  }
  document.getElementById("notUsersTurn").style.display = "block";
  document.getElementById("usersTurn").style.display = "none";
};

export const updateUI = ({
  hasGameStarted,
  isItYourTurn,
  userId,
  numberOfPlayers,
}: {
  hasGameStarted: boolean;
  isItYourTurn: boolean;
  numberOfPlayers: number;
  userId?: number;
}) => {
  if (userId && hasGameStarted) {
    updateUIWithGameStart(isItYourTurn);
  } else if (userId && !hasGameStarted) {
    updateUiWaitingRoom(numberOfPlayers);
  } else if (!userId) {
    updateUiEntryRoom(hasGameStarted);
  }
};
