import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Pusher from "pusher-js";
import { FaUser } from "react-icons/fa";

const AdminChat = () => {
  const [activeUsers, setActiveUsers] = useState({}); // Change to object for easier updates
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const pusherRef = useRef(null);

  // Initialize Pusher
  useEffect(() => {
    pusherRef.current = new Pusher("6801d180c935c080fb57", {
      cluster: "eu"
    });

    const channel = pusherRef.current.subscribe('chat');
    
    channel.bind('message', function(data) {
      // Handle messages from users (not from ADMIN)
      if (data.username !== 'ADMIN') {
        setActiveUsers(prevUsers => {
          const updatedUsers = { ...prevUsers };
          
          if (!updatedUsers[data.username]) {
            updatedUsers[data.username] = {
              username: data.username,
              messages: [],
              lastMessage: '',
              unreadCount: 0
            };
          }

          updatedUsers[data.username].messages.push({
            text: data.message,
            time: new Date().toLocaleTimeString(),
            isAdmin: false
          });
          updatedUsers[data.username].lastMessage = data.message;
          updatedUsers[data.username].unreadCount += 1;

          return updatedUsers;
        });
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const sendAdminResponse = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      // Send message through API
      const response = await fetch("https://atfplatform.tw1.ru/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: 'ADMIN',
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Update local state
      setActiveUsers(prevUsers => {
        const updatedUsers = { ...prevUsers };
        updatedUsers[selectedUser].messages.push({
          text: message,
          time: new Date().toLocaleTimeString(),
          isAdmin: true
        });
        updatedUsers[selectedUser].lastMessage = message;
        return updatedUsers;
      });
      
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
          {Object.values(activeUsers).map(user => (
            <div
              key={user.username}
              onClick={() => {
                setSelectedUser(user.username);
                // Reset unread count when selecting user
                setActiveUsers(prev => ({
                  ...prev,
                  [user.username]: { ...prev[user.username], unreadCount: 0 }
                }));
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser === user.username ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2E92A0] flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">İstifadəçi {user.username}</h3>
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
              <h2 className="text-lg font-medium">
                İstifadəçi {selectedUser}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeUsers[selectedUser]?.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    msg.isAdmin 
                      ? 'bg-[#95C901] text-white' 
                      : 'bg-white border text-[#3F3F3F]'
                  }`}>
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
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