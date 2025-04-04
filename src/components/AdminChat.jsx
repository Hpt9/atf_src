import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Pusher from "pusher-js";

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const adminUsername = "ADMIN"; // Special username for admin

  useEffect(() => {
    // Initial messages load
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://atfplatform.tw1.ru/api/messages");
        const data = await response.json();
        setMessages(data.map(msg => ({
          id: msg.id || Date.now(),
          text: msg.message,
          sender: msg.username,
          isAdmin: msg.username === adminUsername,
          time: new Date(msg.created_at || Date.now()).toLocaleTimeString()
        })));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Real-time updates
    const pusher = new Pusher("6801d180c935c080fb57", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("realtime");
    channel.bind("message", function (data) {
      setMessages(prevMessages => [...prevMessages, {
        id: data.id || Date.now(),
        text: data.message,
        sender: data.username,
        isAdmin: data.username === adminUsername,
        time: new Date().toLocaleTimeString()
      }]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const sendAdminResponse = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      const response = await fetch("https://atfplatform.tw1.ru/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: adminUsername,
          message,
          isAdmin: true // Add this flag to identify admin messages
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
    <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
      <h1 className="text-[32px] font-semibold text-[#2E92A0] mb-8">
        Admin Chat Interface
      </h1>
      
      {/* Messages Display */}
      <div className="border border-[#E7E7E7] rounded-lg bg-white overflow-hidden">
        <div className="h-[600px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${msg.isAdmin ? 'text-right' : 'text-left'}`}
            >
              <div className="inline-block max-w-[70%]">
                <div className="text-sm text-[#3F3F3F] mb-1">
                  {msg.sender} - {msg.time}
                </div>
                <div className={`p-3 rounded-lg ${
                  msg.isAdmin 
                    ? 'bg-[#95C901] text-white' 
                    : 'bg-[#F5F5F5] text-[#3F3F3F]'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-[#E7E7E7]">
          <form onSubmit={sendAdminResponse} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cavabınızı yazın..."
              className="flex-1 px-4 py-2 border border-[#E7E7E7] rounded-lg focus:outline-none focus:border-[#2E92A0]"
            />
            <button 
              type="submit"
              className="bg-[#2E92A0] text-white px-6 py-2 rounded-lg hover:bg-[#267A85] transition-colors"
            >
              <IoSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminChat; 