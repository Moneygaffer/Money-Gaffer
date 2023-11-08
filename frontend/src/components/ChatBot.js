import React, { useState, useEffect } from "react";
import ChatBotCSS from "./ChatBot.module.css";
import Axios from "axios";

const ChatBot = () => {
  const botIcon = require("./images/chatbot2.jpg");
  const bot = require("./images/chatbot.jpg");
  const [isChatOpen, setChatOpen] = useState(false);
  const [reqChat, setReqChat] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 

  const addChatMessage = (message, sender) => {
   
    const newMessage = { message, sender };

   
    setChat((prevChat) => [...prevChat, newMessage]);
  };

  const handleChatClick = () => {
    toggleChat(); // Open or close the chatbot
  };

  useEffect(() => {
    // Fetch chat history when the component mounts
    fetchChatHistory();
  }, []);

  const handleUserInput = () => {
    const userMessage = reqChat.toLowerCase();

    setIsLoading(false);

    if (reqChat.trim() === "") return; // Don't send empty messages

    if (
      userMessage.includes("hello") ||
      userMessage.includes("hi") ||
      userMessage.includes("hey there")
    ) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Greeting intent
      addChatMessage(
        "Hello! Welcome to Money Gaffer. How can I assist you today?",
        "bot"
      );
    } else if (userMessage.includes("money gaffer")) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "Money Gaffer is a comprehensive personal finance platform designed to help you manage your finances effectively. How can I help you get started?",
        "bot"
      );
    }
  
    else if (
      userMessage.includes(" features") ||
      userMessage.includes("what is your service")
    ) {
      // Introduction and explaining features intent
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      addChatMessage(
        "users can effortlessly monitor their spending habits and analyze expenditure trends. Additionally, the platform facilitates efficient loan tracking, simplifies mutual fund management, and empowers users to set and achieve their financial goals with precision and ease."
      );
    } else if (
      userMessage.includes(" expenses") ||
      userMessage.includes("expenses")
    ) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "Money Gaffer is a comprehensive personal finance platform designed to help you manage your finances effectively. How can I help you get started?",
        "bot"
      );
    } else if (userMessage.includes('"How can I track my income?')) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "You can add your income sources, and Money Gaffer will help you keep tabs on your earnings"
      );
    } else if (userMessage.includes("How can I filter my financial records?")) {
      // Introduction and explaining features intent
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      addChatMessage(
        "Money Gaffer offers robust filtering tools to help you access specific financial data. Let me guide you through it"
      );
    } else if (
      userMessage.includes(
        "Guide me on mutual fund management Help with mutual funds"
      )
    ) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "Money Gaffer assists you in managing your mutual fund investments. How can I assist you further?"
      );
    } else if (userMessage.includes("How can I set financial goals?")) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "With Money Gaffer, you can set and track your financial objectives. Let's get started with your goals."
      );
    } else if (
      userMessage.includes("What insights can Money Gaffer provide?")
    ) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "Money Gaffer's data visualization tools offer comprehensive reports and graphical representations for valuable financial insights."
      );
    } else if (userMessage.includes("How's my experience with Money Gaffer?")) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "Your feedback is important to us. Please share your thoughts on your experience with Money Gaffer."
      );
    } else if (
      userMessage.includes(
        "I'm facing issues with Money Gaffer Help with a problem"
      )
    ) {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      // Introduction and explaining features intent
      addChatMessage(
        "I'm here to assist. Please describe the issue, and I'll do my best to help you resolve it."
      );
    } else {
      addChatMessage(userMessage, "user");

      setIsLoading(true);
      addChatMessage(
        "I didn't get you..Give me the relevant information i'm happy to help you !!"
      );
    }

    setReqChat("");
    setIsLoading(false);
  };

  const fetchChatHistory = () => {
    // Make an HTTP GET request to fetch chat history
    Axios.get("http://localhost:3000/get-history/user123") // Replace 'user123' with the actual user identifier
      .then((response) => {
        const chatHistory = response.data;
        setChat(chatHistory);
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      });
  };

  const toggleChat = () => {
    setChatOpen(!isChatOpen); // Toggle the chatbot visibility
  };

  return (
    <div className={ChatBotCSS.chatbot_container}>
      <img
        src={botIcon}
        alt="Chat Icon"
        onClick={handleChatClick}
        className={ChatBotCSS.chatbot_icon} 
      />
      {isChatOpen && (
        <div className={ChatBotCSS.chat_box}>
          <div className={ChatBotCSS.chat_bot_header}>
            <h2>
              <span>
                <img src={bot} alt="React Image" />
              </span>
              Money Gaffer Chat-bot
            </h2>
          </div>
          <div className={ChatBotCSS.chat_body}>
            {chat.map((message, index) => (
              <div
                key={index}
                className={`${ChatBotCSS.chat_message} ${
                  message.sender === "user" ? "user" : "bot"
                }`}
              >
                {message.message}
              </div>
            ))}
            {isLoading && (
              <div className={ChatBotCSS.loader}>Getting your response...</div>
            )}
          </div>

          <div className={ChatBotCSS.chat_input}>
            <input
              type="text"
              placeholder="Enter your query"
              value={reqChat}
              onChange={(e) => setReqChat(e.target.value)}
            />
            <button className={ChatBotCSS.send} onClick={handleUserInput}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;