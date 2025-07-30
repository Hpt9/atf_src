import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
// import ChatMessageItem from './ChatMessageItem';
import axios from 'axios';
import { getTokenCookie } from '../utils/cookieUtils';

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const bottomRef = useRef(null);

  // Fetch user data function
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('https://atfplatform.tw1.ru/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.data) {
        console.log('User logged in:', response.data);
        setIsLoggedIn(true);
        setUserId(response.data.id);
        setUserName(response.data.name || 'User');
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
      setUserId(null);
      return null;
    }
  };

  // Check if user is logged in and set userId
  useEffect(() => {
    const token = getTokenCookie();
    if (token) {
      fetchUserData(token);
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
      const res = await fetch('https://atfplatform.tw1.ru/api/messages/1', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${getTokenCookie()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
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
          username: msg.username || (msg.type === 'response' ? 'Support' : userName)
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
    console.log('💬 Chat toggle:', newOpenState);
    if (!isLoggedIn) {
      console.log('🚫 Chat toggle ignored - user not logged in');
      return;
    }
    setOpen(newOpenState);
    if (newOpenState && userId) {
      console.log('📡 Opening chat for user:', userId);
      refreshMessages();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !isLoggedIn || !userId) return;
    
    const newMessage = {
      message: message.trim(),
      user_id: userId,
      created_at: new Date().toISOString(),
      type: 'request',
      username: userName
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
          Authorization: `Bearer ${getTokenCookie()}`,
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
