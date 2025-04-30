import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAuth } from "../context/AuthContext";

// Initialize Pusher and Echo
window.Pusher = Pusher;

// Create Echo instance with proper configuration
const createEchoInstance = () => {
  return new Echo({
    broadcaster: 'pusher',
    key: '6801d180c935c080fb57',
    cluster: 'eu',
    forceTLS: true,
    encrypted: true,
    authEndpoint: 'https://atfplatform.tw1.ru/broadcasting/auth',
    auth: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': window.location.origin
      },
    },
    wsHost: 'atfplatform.tw1.ru',
    wsPort: 6001,
    wssPort: 6001,
    disableStats: true,
    enabledTransports: ['ws', 'wss']
  });
};

let echoInstance = null;

const AdminChat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const isSupport = user?.name === "Admin" || user?.role === "support";

  // Initialize Echo instance
  useEffect(() => {
    if (!user?.id) return;

    // Create new Echo instance with current token
    echoInstance = createEchoInstance();

    // Cleanup on unmount
    return () => {
      if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
      }
    };
  }, [user?.id]);

  // Fetch users list for support
  useEffect(() => {
    if (!isSupport) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch("https://atfplatform.tw1.ru/api/support/users", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUsers(data);
        // Select first user by default if none selected
        if (!selectedUserId && data.length > 0) {
          setSelectedUserId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [isSupport, token]);

  // Refresh messages function
  const refreshMessages = async () => {
    if (!selectedUserId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://atfplatform.tw1.ru/api/messages/${selectedUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.messages)) {
        setMessages(data.messages.map(msg => ({
          id: msg.id || Date.now(),
          text: msg.message,
          sender: msg.username,
          isSupport: msg.username === "Admin" || msg.role === "support",
          time: new Date(msg.created_at || Date.now()).toLocaleTimeString()
        })));
      }
    } catch (error) {
      console.error("Error refreshing messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup real-time updates
  useEffect(() => {
    if (!user?.id || !echoInstance || !selectedUserId) {
      console.log('🔄 Skipping real-time setup:', { 
        hasUserId: !!user?.id, 
        hasEcho: !!echoInstance, 
        selectedUserId 
      });
      return;
    }

    try {
      console.log('🔌 Attempting to connect to channel:', `chat.${selectedUserId}`);
      const channel = echoInstance.private(`chat.${selectedUserId}`);
      channelRef.current = channel;

      // Connection state listeners
      channel.listen('pusher:subscription_succeeded', () => {
        console.log('✅ Successfully subscribed to channel:', `chat.${selectedUserId}`);
        setConnectionState('connected');
      });

      channel.listen('pusher:subscription_error', (error) => {
        console.error('❌ Subscription error:', error);
        setConnectionState('error');
        setTimeout(() => {
          if (echoInstance) {
            console.log('🔄 Attempting to reconnect...');
            echoInstance.connect();
          }
        }, 5000);
      });

      // Connection state change listener
      echoInstance.connector.pusher.connection.bind('state_change', (states) => {
        console.log('🔄 Connection state changed:', {
          previous: states.previous,
          current: states.current
        });
        setConnectionState(states.current);
      });

      // Listen for new messages
      channel.listen('.new.message', (e) => {
        console.log('📨 Received message event:', e);
        if (e?.message) {
          setMessages(prev => {
            console.log('Current messages:', prev);
            const exists = prev.some(msg => 
              msg.id === e.message.id || 
              (msg.text === e.message.message && 
               msg.sender === e.message.username && 
               !msg.id)
            );
            
            if (!exists) {
              console.log('📩 Adding new message to state:', e.message);
              return [...prev, {
                id: e.message.id || Date.now(),
                text: e.message.message,
                sender: e.message.username,
                isSupport: e.message.username === "Admin" || e.message.role === "support",
                time: new Date(e.message.created_at || Date.now()).toLocaleTimeString()
              }];
            }
            console.log('🔄 Message already exists, skipping:', e.message);
            return prev;
          });
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });

    } catch (error) {
      console.error('❌ Error setting up real-time connection:', error);
      setConnectionState('error');
    }

    return () => {
      if (channelRef.current) {
        console.log('🔌 Cleaning up channel subscription:', `chat.${selectedUserId}`);
        channelRef.current.stopListening('.new.message');
        if (echoInstance) {
          echoInstance.leave(`chat.${selectedUserId}`);
        }
      }
    };
  }, [token, user, selectedUserId, isSupport]);

  // Auto-refresh messages when selected user changes
  useEffect(() => {
    if (selectedUserId) {
      console.log('👤 Selected user changed, refreshing messages for:', selectedUserId);
      refreshMessages();
    }
  }, [selectedUserId]);

  // Auto-reconnect logic
  useEffect(() => {
    const reconnectInterval = setInterval(() => {
      if (connectionState === 'error' && echoInstance) {
        console.log('Attempting to reconnect...');
        echoInstance.connect();
      }
    }, 10000);

    return () => clearInterval(reconnectInterval);
  }, [connectionState]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendResponse = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUserId) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: user.name,
      isSupport: isSupport,
      time: new Date().toLocaleTimeString()
    };

    console.log('📤 Sending message:', newMessage);

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);
    setMessage(''); // Clear input immediately

    try {
      console.log('🚀 Making API request to send message...');
      const response = await fetch("https://atfplatform.tw1.ru/api/messages/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: selectedUserId,
          message: newMessage.text
        }),
      });

      const data = await response.json();
      console.log('✅ API response:', data);

      if (!response.ok) {
        console.error('❌ Failed to send message:', data);
        // If sending failed, remove the optimistically added message
        setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="w-full max-w-[2136px] px-[16px] md:px-[32px] lg:px-[50px] xl:px-[108px] py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[32px] font-semibold text-[#2E92A0]">
          Support Chat Interface
        </h1>
        <div className="flex items-center gap-4">
          <div className="connection-status">
            {connectionState === 'connected' && (
              <span className="text-green-500">Connected</span>
            )}
            {connectionState === 'connecting' && (
              <span className="text-yellow-500">Connecting...</span>
            )}
            {connectionState === 'error' && (
              <span className="text-red-500">Connection Error</span>
            )}
          </div>
          <button 
            onClick={refreshMessages}
            className="px-4 py-2 bg-[#2E92A0] text-white rounded-lg hover:bg-[#267A85] transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Messages'}
          </button>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* Users list for support */}
        {isSupport && (
          <div className="w-64 border border-[#E7E7E7] rounded-lg bg-white overflow-hidden">
            <div className="p-4 border-b border-[#E7E7E7]">
              <h2 className="font-semibold">Users</h2>
            </div>
            <div className="h-[600px] overflow-y-auto">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full p-4 text-left hover:bg-[#F5F5F5] ${
                    selectedUserId === user.id ? 'bg-[#F5F5F5]' : ''
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Display */}
        <div className="flex-1 border border-[#E7E7E7] rounded-lg bg-white overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${msg.isSupport ? 'text-right' : 'text-left'}`}
              >
                <div className="inline-block max-w-[70%]">
                  <div className="text-sm text-[#3F3F3F] mb-1">
                    {msg.sender} - {msg.time}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    msg.isSupport 
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
            <form onSubmit={sendResponse} className="flex gap-2">
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
    </div>
  );
};

export default AdminChat; 