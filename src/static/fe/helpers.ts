export const startWebSocket = () => {
  const webSocket = new WebSocket("ws://localhost:8080");
  webSocket.onopen = (event) => {
    console.log("webSocket open");
  };
  webSocket.onmessage = ({ data }) => {
    console.log(`Ws: BE is sending some data: ${data}`);
    updatePublicNumber(JSON.parse(data).publicNumber);
  };
};

export const throwMissingPropError = ({
  method,
  url,
  jsonResponse,
  propName,
}) => {
  throw new Error(
    `Missing prop ${propName} from response to ${method} ${url}. Recieved ${jsonResponse}`
  );
};

export const updateUIWithUser = () => {
  document.getElementById("createUserButton").style.display = "none";
  document.getElementById("privateNumberSection").style.display = "block";
};

export const updatePublicNumber = (newPublicNumber) => {
  document.getElementById("publicNumber").innerHTML = newPublicNumber;
};

export const updatePrivateNumber = (newPrivateNumber) => {
  document.getElementById("privateNumber").innerHTML = newPrivateNumber;
};

export const getUserIdFromCurrentUrl = () => {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;
  const userId = searchParams.get("userId");
  return userId;
};
