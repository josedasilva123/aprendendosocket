/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000", { transports: ["websocket"] });
socket.on("connect", () =>
  console.log("[IO] Connect: A new connection has been started")
);

const Chat = () => {
  const [counter, setCounter] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
        setMessages([...messages, newMessage]);        
    }
    socket.on('chat.message', handleNewMessage);
        return () => {
            socket.off('chat.message', handleNewMessage);
        }
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat.message", {
        id: counter,
        message,
      });
      setCounter(counter + 1); 
      setMessage("");
     
    }
  }
  return (
    <main className="container">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <span className="message">{message.message}</span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a new message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
};

export default Chat;
