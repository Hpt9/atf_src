import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from 'uuid';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  // Generate and store unique username
  const [username] = useState(() => {
    const stored = localStorage.getItem('chat_user_id');
    if (stored) return stored;
    
    const newId = uuidv4().slice(0, 8); // Using shorter ID for username
    localStorage.setItem('chat_user_id', newId);
    return newId;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("6801d180c935c080fb57", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("realtime");
    channel.bind("message", function (data) {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now(),
        text: data.message,
        sender: data.username,
        isUser: data.username === username,
        time: new Date().toLocaleTimeString()
      }]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [username]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      const response = await fetch("https://atfplatform.tw1.ru/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-[60px] h-[60px] bg-[#95C901] rounded-full flex items-center justify-center shadow-lg hover:bg-[#86b401] transition-colors"
        >
          <span className="text-white text-2xl">💬</span>
        </button>
      ) : (
        <div className="bg-white rounded-[16px] w-[400px] shadow-xl">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-[#3F3F3F] text-xl font-medium">Dəstək xidməti</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.isUser ? "items-end" : "items-start"
                }`}
              >
                {!msg.isUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUser className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">{msg.sender}</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-[8px] ${
                    msg.isUser
                      ? "bg-[#2E92A0] text-white"
                      : msg.sender === "ADMIN"
                        ? "bg-[#95C901] text-white"
                        : "bg-[#F5F5F5] text-[#3F3F3F]"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <form onSubmit={submit} className="flex items-center gap-2">
              <button 
                type="button"
                className="text-gray-500 hover:text-[#2E92A0] transition-colors"
              >
                <IoAttach size={20} />
              </button>
              <input
                type="text"
                placeholder="Mesajınızı yazın"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E92A0]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="text-[#2E92A0] hover:text-[#247885] transition-colors"
              >
                <IoSend size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 