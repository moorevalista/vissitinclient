import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

import moment from 'moment-timezone';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
//const SOCKET_SERVER_URL = "http://localhost:4000";
const SOCKET_SERVER_URL = "https://chat.vissit.in";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
        timestamp: moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss"),
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, messages]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChat;