import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const messages = [
    {
      id: 1,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry..",
      time: "Cümə 12:05",
      isUser: true,
    },
    {
      id: 2,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "Cümə 12:15",
      isUser: false,
      sender: "Elşad Qarayev",
    },
    {
      id: 3,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry..",
      time: "Cümə 12:16",
      isUser: true,
    },
  ];

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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.isUser ? "items-end" : "items-start"
                }`}
              >
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUser className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">{message.sender}</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-[8px] ${
                    message.isUser
                      ? "bg-[#2E92A0] text-white"
                      : "bg-[#F5F5F5] text-[#3F3F3F]"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">{message.time}</span>
              </div>
            ))}
          </div>

          {/* Feedback Buttons */}
          <div className="flex justify-center gap-4 py-3 border-t">
            <button className="text-gray-500 hover:text-green-500 transition-colors">
              <FaRegThumbsUp size={20} />
            </button>
            <button className="text-gray-500 hover:text-red-500 transition-colors">
              <FaRegThumbsDown size={20} />
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-[#2E92A0] transition-colors">
                <IoAttach size={20} />
              </button>
              <input
                type="text"
                placeholder="Mesajınızı yazın"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#2E92A0]"
              />
              <button className="text-[#2E92A0] hover:text-[#247885] transition-colors">
                <IoSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 