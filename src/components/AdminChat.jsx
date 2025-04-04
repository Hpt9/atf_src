import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Pusher from "pusher-js";
import { FaUser } from "react-icons/fa";

const AdminChat = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const adminUsername = "ADMIN";

  // Fetch all users with chat history
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://atfplatform.tw1.ru/api/chat-users");
        const data = await response.json();
        setActiveUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://atfplatform.tw1.ru/api/messages/${selectedUser.userId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Subscribe to selected user's channel
    const pusher = new Pusher("6801d180c935c080fb57", {
      cluster: "eu",
    });

    const channel = pusher.subscribe(`chat-${selectedUser.userId}`);
    channel.bind("message", function (data) {
      setMessages(prevMessages => [...prevMessages, data]);
      // Update last message in users list
      setActiveUsers(prevUsers => 
        prevUsers.map(user => 
          user.userId === selectedUser.userId 
            ? { ...user, lastMessage: data.message, lastMessageTime: new Date() }
            : user
        )
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [selectedUser]);

  const sendAdminResponse = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUser) return;

    try {
      const response = await fetch("https://atfplatform.tw1.ru/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: selectedUser.userId,
          username: adminUsername,
          message,
          isAdmin: true
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
    <div className="flex h-screen bg-gray-100">
      {/* Users List */}
      <div className="w-1/4 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-[#2E92A0]">Aktiv İstifadəçilər</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {activeUsers.map(user => (
            <div
              key={user.userId}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.userId === user.userId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2E92A0] flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">İstifadəçi {user.userId.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
                {user.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#95C901] text-white text-xs flex items-center justify-center">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-medium">İstifadəçi {selectedUser.userId.slice(0, 8)}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.isAdmin 
                      ? 'bg-[#95C901] text-white' 
                      : 'bg-white border text-[#3F3F3F]'
                  }`}>
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t">
              <form onSubmit={sendAdminResponse} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2E92A0]"
                />
                <button 
                  type="submit"
                  className="bg-[#2E92A0] text-white px-6 py-2 rounded-lg hover:bg-[#267A85]"
                >
                  <IoSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Söhbət başlatmaq üçün istifadəçi seçin
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat; 