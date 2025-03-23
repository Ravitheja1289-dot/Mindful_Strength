import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = { sender: "user", text: message };
    setChat([...chat, userMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", { message });
      const botMessage = {
        sender: "bot",
        text: `Emotion: ${response.data.emotion}\nResponse: ${response.data.response}`
      };
      setChat([...chat, userMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Mental Health Assistant</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
