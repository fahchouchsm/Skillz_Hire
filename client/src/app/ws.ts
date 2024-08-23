import { useEffect, useRef, useState } from "react";
import WebSocket from "isomorphic-ws";

const useWebSocket = (url: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const reconnectInterval = 3000;

  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(url);

      wsRef.current?.addEventListener("open", () => {
        setConnected(true);
      });

      wsRef.current?.addEventListener("message", (event: MessageEvent) => {
        console.log("Message from server:", event.data);
      });

      wsRef.current?.addEventListener("close", () => {
        setConnected(false);
        setTimeout(connectWebSocket, reconnectInterval);
      });
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string | object) => {
    if (connected && wsRef.current) {
      const messageToSend =
        typeof message === "string" ? message : JSON.stringify(message);
      wsRef.current.send(messageToSend);
    } else {
      console.error("WebSocket connection not ready.");
    }
  };

  return { sendMessage };
};

export default useWebSocket;
