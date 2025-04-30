import { useState, useEffect, useRef } from 'react';
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

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
    authEndpoint: 'https://atfplatform.tw1.ru/api/broadcasting/auth',
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
    enabledTransports: ['ws', 'wss'],
    disableStats: true
  });
};

let echoInstance = null;

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected');
  const bottomRef = useRef(null);
  const channelRef = useRef(null);

  // Check if user is logged in and set userId
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('User logged in:', user);
        setIsLoggedIn(true);
        setUserId(user.id);
        
        // Initialize Echo instance here after we have the user data
        if (!echoInstance) {
          echoInstance = createEchoInstance();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('No user logged in');
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  // Refresh messages function
  const refreshMessages = async () => {
    if (!userId || !isLoggedIn) {
      console.log('Cannot fetch messages - no user ID or not logged in');
      return;
    }

    console.log('Fetching messages for user:', userId);
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://atfplatform.tw1.ru' : 'https://atfplatform.tw1.ru'}/api/messages/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
      console.log('Messages response:', res.status);
      const data = await res.json();
      console.log('Messages data:', data);
      
      if (data.status === 'success' && Array.isArray(data.messages)) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.id,
          message: msg.message,
          type: msg.type || (msg.user_id === userId ? 'request' : 'response'),
          created_at: msg.created_at,
          username: msg.username || (msg.type === 'response' ? 'Support' : JSON.parse(localStorage.getItem('user')).name)
        }));
        setMessages(formattedMessages);
        // Scroll to bottom after messages load
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        console.error('Unexpected messages data format:', data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages when chat is opened or user ID changes
  useEffect(() => {
    console.log('Load messages effect triggered:', { open, isLoggedIn, userId });
    
    if (!open || !isLoggedIn || !userId) {
      console.log('Skipping message load because:', { open, isLoggedIn, userId });
      return;
    }

    refreshMessages();
  }, [open, isLoggedIn, userId]);

  const handleChatToggle = (newOpenState) => {
    console.log('Chat toggle:', newOpenState);
    if (!isLoggedIn) {
      console.log('Chat toggle ignored - user not logged in');
      return;
    }
    setOpen(newOpenState);
    if (newOpenState && userId) {
      // Fetch messages when opening the chat and we have a user ID
      refreshMessages();
    }
  };

  // Setup real-time updates
  useEffect(() => {
    if (!userId || !echoInstance) {
      console.log('🔄 Skipping real-time setup:', { 
        hasUserId: !!userId, 
        hasEcho: !!echoInstance 
      });
      return;
    }

    try {
      console.log('🔌 Attempting to connect to channel:', `chat.${userId}`);
      const channel = echoInstance.private(`chat.${userId}`);
      channelRef.current = channel;

      // Connection state listeners
      channel.listen('pusher:subscription_succeeded', () => {
        console.log('✅ Successfully subscribed to channel:', `chat.${userId}`);
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
              (msg.message === e.message.message && 
               msg.username === e.message.username && 
               !msg.id)
            );
            
            if (!exists) {
              console.log('📩 Adding new message to state:', e.message);
              const newMsg = {
                id: e.message.id || Date.now(),
                message: e.message.message,
                username: e.message.username,
                type: e.message.role === 'support' ? 'response' : 'request',
                created_at: e.message.created_at || new Date().toISOString()
              };
              return [...prev, newMsg];
            }
            console.log('🔄 Message already exists, skipping:', e.message);
            return prev;
          });
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });

    } catch (error) {
      console.error('❌ Error setting up real-time connection:', error);
      setConnectionState('error');
    }

    return () => {
      if (channelRef.current) {
        console.log('🔌 Cleaning up channel subscription:', `chat.${userId}`);
        channelRef.current.stopListening('.new.message');
        if (echoInstance) {
          echoInstance.leave(`chat.${userId}`);
        }
      }
    };
  }, [userId, echoInstance]);

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

  const sendMessage = async () => {
    if (!message.trim() || !isLoggedIn || !userId) return;
    
    const newMessage = {
      message: message.trim(),
      user_id: userId,
      created_at: new Date().toISOString(),
      type: 'request',
      username: JSON.parse(localStorage.getItem('user')).name
    };

    console.log('📤 Sending message:', newMessage);

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);
    setMessage(""); // Clear input immediately

    try {
      console.log('🚀 Making API request to send message...');
      const res = await fetch(`https://atfplatform.tw1.ru/api/messages/send-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          support_id: 1,
          message: newMessage.message
        }),
      });

      const data = await res.json();
      console.log('✅ API response:', data);

      if (!res.ok) {
        console.error('❌ Failed to send message:', data);
        // If sending failed, remove the optimistically added message
        setMessages(prev => prev.filter(msg => msg !== newMessage));
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // If sending failed, remove the optimistically added message
      setMessages(prev => prev.filter(msg => msg !== newMessage));
    }
  };

  // If user is not logged in, don't render the chat widget
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed md:bottom-6 md:right-6 z-[10000]">
      <AnimatePresence mode="wait">
        {!open ? (
          <button
            key="chat-button"
            onClick={() => handleChatToggle(true)}
            className="w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg fixed bottom-6 right-6 bg-[#2E92A0] hover:bg-[#2e93a089] hover:scale-105 transition-all duration-200 hover:cursor-pointer"
          >
            💬
          </button>
        ) : (
          <div 
            key="chat-window"
            className="bg-white md:rounded-[16px] w-full md:w-[400px] shadow-xl fixed inset-0 md:inset-auto md:fixed md:bottom-6 md:right-6 flex flex-col h-screen md:h-[70vh] overflow-hidden" 
            style={{ height: window.innerWidth >= 768 ? '70vh' : 'calc(100vh)' }}
          >
            {/* Chat Header */}
            <div className="flex-none flex justify-between items-center px-4 py-5 bg-white relative">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] w-full font-medium text-[#111] text-center">Dəstək xidməti</h2>
                <div className="connection-status">
                  {connectionState === 'connected' && (
                    <span className="text-green-500 text-xs">Connected</span>
                  )}
                  {connectionState === 'connecting' && (
                    <span className="text-yellow-500 text-xs">Connecting...</span>
                  )}
                  {connectionState === 'error' && (
                    <span className="text-red-500 text-xs">Connection Error</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={refreshMessages}
                  className="px-2 py-1 bg-[#2E92A0] text-white text-xs rounded-lg hover:bg-[#267A85] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={() => handleChatToggle(false)}
                  className="p-[5px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded-[8px] hover:bg-gray-100 hover:scale-105 transition-all duration-200 hover:cursor-pointer"
                >
                  <IoClose size={32} className="text-[#111]" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 bg-white">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-fit flex items-center justify-center">
                  <span className="text-gray-400">Hələ heç bir mesaj yoxdur</span>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id || `temp-${msg.created_at}`}
                    className={`mb-2 ${msg.type === 'request' ? 'text-right' : 'text-left'}`}
                  >
                    <span 
                      className={`inline-block p-2 rounded-2xl ${
                        msg.type === 'request'
                          ? 'bg-[#2E92A0] text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.message}
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </span>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Chat Input */}
            <div className="flex-none bg-white">
              <div className="px-4 py-3 border-t border-[#F5F5F5]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-2 bg-[white] rounded-[8px] border border-[#E7E7E7]"
                >
                  <input
                    type="text"
                    placeholder="Mesajınızı yazın"
                    className="flex-1 rounded-full pl-4 py-3 text-[15px] focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex items-center">
                    <button 
                      type="submit"
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <span className="text-[#111]">📩</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
