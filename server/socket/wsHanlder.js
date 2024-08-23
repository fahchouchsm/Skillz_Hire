const WebSocket = require("ws");
const colors = require("colors");
const { lastOnline } = require("../functions/functions");

let connectedClients = [];

const handleWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(`Client connected: ${clientIp}`.cyan);

    connectedClients.push({ ws, clientIp });

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        handleIncomingMessage(parsedMessage, ws);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });

    ws.on("close", () => {
      console.log(`Client disconnected: ${clientIp}`.red);
      connectedClients = connectedClients.filter((client) => client.ws !== ws);
    });
  });
};
const handleIncomingMessage = (message, ws) => {
  const { type, data } = message;

  switch (type) {
    case "lastOnlineUpdate":
      lastOnline(data);
      break;
    default:
      console.log("Unknown message type:", type);
  }
};

const broadcastMessage = (message) => {
  connectedClients.forEach((client) => {
    client.ws.send(message);
  });
};

const getConnectedClients = () => {
  return connectedClients;
};

module.exports = {
  handleWebSocket,
  broadcastMessage,
  getConnectedClients,
};
