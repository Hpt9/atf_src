import { useState, useEffect, useRef } from 'react';
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

// Initialize Pusher and Echo with proper configuration
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
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });
};

let echoInstance = null;

export default function ChatWidget({ userId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loadingOld, setLoadingOld] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const bottomRef = useRef(null);
  const channelRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, []);

  // Initialize Echo instance
  useEffect(() => {
    if (!userId) return;

    // Create new Echo instance with current token
    echoInstance = createEchoInstance();

    // Cleanup on unmount
    return () => {
      if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
      }
    };
  }, [userId]);

  const fetchOldMessages = async () => {
    if (loadingOld) return;
    
    setLoadingOld(true);
    try {
      const res = await fetch('https://atfplatform.tw1.ru/api/messages-by-user/1', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (data.status === "success" && Array.isArray(data.messages)) {
        setMessages(prevMessages => {
          const oldMessages = data.messages.filter(
            oldMsg => !prevMessages.some(msg => msg.id === oldMsg.id)
          );
          return [...oldMessages, ...prevMessages];
        });
    }
    } catch (error) {
      console.error('Error fetching old messages:', error);
    } finally {
      setLoadingOld(false);
    }
  };

  const handleChatToggle = (newOpenState) => {
    if (!isLoggedIn) return;
    setOpen(newOpenState);
  };

  const sendMessage = async () => {
    if (!message.trim() || !isLoggedIn) return;
    
    const newMessage = {
      message: message.trim(),
      user_id: JSON.parse(localStorage.getItem('user')).id,
      created_at: new Date().toISOString(),
      type: 'request' // Only for UI, won't be sent to API
    };

    // Optimistically add message to UI
    setMessages(prev => [...prev, newMessage]);
    setMessage(""); // Clear input immediately

    try {
      const res = await fetch(`https://atfplatform.tw1.ru/api/messages/send-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          support_id: 1,
          message: newMessage.message,
        }),
      });

      const data = await res.json();
      if (data.status !== "success") {
        // If sending failed, remove the optimistically added message
        setMessages(prev => prev.filter(msg => msg !== newMessage));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // If sending failed, remove the optimistically added message
      setMessages(prev => prev.filter(msg => msg !== newMessage));
    }
  };

  // Setup real-time updates with Pusher
  useEffect(() => {
    if (!userId || !echoInstance) return;

    try {
      // Subscribe to the private channel
      const channel = echoInstance.private(`chat.${userId}`);
      channelRef.current = channel;

      // Listen for new messages
      channel.listen('.MessageSent', (e) => {
        console.log('Received message:', e);
        if (e?.message) {
          setMessages(prev => {
            // Check if message already exists
            const exists = prev.some(msg => 
              msg.id === e.message.id || 
              (msg.message === e.message.message && 
               msg.user_id === e.message.user_id && 
               !msg.id)
            );
            
            if (!exists) {
              return [...prev, e.message];
            }
            return prev;
          });
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Listen for connection states
      channel.listen('pusher:subscription_succeeded', () => {
        console.log('Successfully subscribed to channel');
      });

      channel.listen('pusher:subscription_error', (error) => {
        console.error('Subscription error:', error);
      });

    } catch (error) {
      console.error('Error setting up real-time connection:', error);
    }

    // Cleanup
    return () => {
      if (channelRef.current) {
        channelRef.current.stopListening('.MessageSent');
        if (echoInstance) {
          echoInstance.leave(`chat.${userId}`);
        }
      }
    };
  }, [userId, echoInstance]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              <h2 className="text-[18px] w-full font-medium text-[#111] text-center">Dəstək xidməti</h2>
              <button
                onClick={() => handleChatToggle(false)}
                className="p-[5px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded-[8px] hover:bg-gray-100 absolute top-3 right-4 hover:scale-105 transition-all duration-200 hover:cursor-pointer"
              >
                <IoClose size={32} className="text-[#111]" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 bg-white">
              {/* Load Previous Messages Button */}
              <div className="sticky top-0 pt-2 pb-2 z-10 bg-white">
                <button
                  onClick={fetchOldMessages}
                  disabled={loadingOld}
                  className="w-full py-2 px-4 text-sm text-[#2E92A0] bg-white border border-[#2E92A0] rounded-lg hover:bg-[#2E92A0] hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  {loadingOld ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-[#2E92A0] border-t-transparent rounded-full animate-spin mr-2"></div>
                      Yüklənir...
                    </div>
                  ) : (
                    "Köhnə mesajları yüklə"
                  )}
                </button>
              </div>

              {messages.length === 0 ? (
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
