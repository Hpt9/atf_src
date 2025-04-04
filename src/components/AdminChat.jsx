import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Pusher from "pusher-js";
import { FaUser } from "react-icons/fa";

const AdminChat = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const adminUsername = "ADMIN";
  const pusherRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});

  // Initialize Pusher
  useEffect(() => {
    pusherRef.current = new Pusher("6801d180c935c080fb57", {
      cluster: "eu"
    });
  }, []);

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

  // Subscribe to public admin channel
  useEffect(() => {
    if (!pusherRef.current) return;

    const adminChannel = pusherRef.current.subscribe('admin-channel');
    
    // Listen for new messages from users
    adminChannel.bind('client-new-message', function(data) {
      const { username, message, time } = data;
      
      // Add new user or update existing user
      setActiveUsers(prevUsers => {
        const existingUser = prevUsers.find(u => u.username === username);
        if (!existingUser) {
          return [...prevUsers, {
            username,
            messages: [{
              text: message,
              time,
              isAdmin: false
            }],
            lastMessage: message,
            lastMessageTime: new Date(),
            unreadCount: 1
          }];
        }

        return prevUsers.map(user => 
          user.username === username 
            ? {
                ...user,
                messages: [...user.messages, {
                  text: message,
                  time,
                  isAdmin: false
                }],
                lastMessage: message,
                lastMessageTime: new Date(),
                unreadCount: user.unreadCount + 1
              }
            : user
        );
      });
    });

    // Listen for user typing status
    adminChannel.bind('client-user-typing', function(data) {
      const { username, typing } = data;
      setTypingUsers(prev => ({ ...prev, [username]: typing }));
    });

    return () => {
      adminChannel.unbind_all();
      adminChannel.unsubscribe();
    };
  }, []);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!selectedUser) return;

    // Clear previous timeout
    if (typingTimeoutRef.current[selectedUser.username]) {
      clearTimeout(typingTimeoutRef.current[selectedUser.username]);
    }

    // Send typing status to user
    const pusher = new Pusher("6801d180c935c080fb57", { cluster: "eu" });
    const userChannel = pusher.subscribe(`chat-user-${selectedUser.username}`);
    
    userChannel.trigger('admin-typing', {
      typing: true
    });

    // Stop typing after 1 second
    typingTimeoutRef.current[selectedUser.username] = setTimeout(() => {
      userChannel.trigger('admin-typing', {
        typing: false
      });
    }, 1000);
  };

  const sendAdminResponse = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      const pusher = new Pusher("6801d180c935c080fb57", { cluster: "eu" });
      
      // Send to specific user's channel
      const userChannel = pusher.subscribe(`chat-user-${selectedUser.username}`);
      userChannel.trigger('admin-message', {
        message,
        time: new Date().toLocaleTimeString()
      });

      // Update active users with new message
      setActiveUsers(prevUsers =>
        prevUsers.map(user =>
          user.username === selectedUser.username
            ? {
                ...user,
                messages: [...user.messages, {
                  text: message,
                  time: new Date().toLocaleTimeString(),
                  isAdmin: true
                }]
              }
            : user
        )
      );
      
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Get selected user's messages when user is selected
  const selectedUserMessages = selectedUser ? 
    activeUsers.find(u => u.username === selectedUser.username)?.messages || [] 
    : [];

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
              key={user.username}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.username === user.username ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2E92A0] flex items-center justify-center text-white">
                  <FaUser />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">İstifadəçi {user.username}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {typingUsers[user.username] ? 'Typing...' : user.lastMessage}
                  </p>
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
                İstifadəçi {selectedUser.username}
                {typingUsers[selectedUser.username] && (
                  <span className="text-sm text-gray-500 ml-2">typing...</span>
                )}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedUserMessages.map((msg, index) => (
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
                  onChange={handleTyping}
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