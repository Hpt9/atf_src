import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { LuLink } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { VscSend } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username] = useState("FERID");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   // Initial messages load
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await fetch("https://atfplatform.tw1.ru/api/messages");
  //       const data = await response.json();
  //       setMessages(data.map(msg => ({
  //         id: msg.id || Date.now(),
  //         text: msg.message,
  //         sender: msg.username,
  //         isUser: msg.username === username,
  //         time: new Date(msg.created_at || Date.now()).toLocaleTimeString()
  //       })));
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [username]);

  useEffect(() => {
    // Real-time updates with Pusher
    const pusher = new Pusher("6801d180c935c080fb57", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("realtime");
    channel.bind("message", function (data) {
      setMessages(prevMessages => [...prevMessages, {
        id: data.id || Date.now(),
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

  // Add useEffect for scroll locking
  useEffect(() => {
    if (isOpen) {
      // Lock scroll on body
      document.body.style.overflow = 'hidden';
      // Add padding to prevent content shift if there's a scrollbar
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Restore scroll
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Add function to handle iOS viewport height
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh(); // Set initial value
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

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
          message,
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
    <div className="fixed md:bottom-6 md:right-6 z-[10000]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="w-[60px] h-[60px] bg-[#2E92A0] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2e93a089]  fixed bottom-6 right-6 hover:scale-105 transition-all duration-200 hover:cursor-pointer"
          >
            <HiOutlineChatBubbleLeftRight className="text-white text-2xl" />
          </motion.button>
        ) : (
          <motion.div 
            key="chat-window"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="bg-white md:rounded-[16px] w-full md:w-[400px] shadow-xl fixed inset-0 md:inset-auto md:fixed md:bottom-6 md:right-6 flex flex-col h-screen md:h-[70vh] overflow-hidden" 
            style={{ 
              height: window.innerWidth >= 768 ? '70vh' : 'calc(var(--vh, 1vh) * 100)'
            }}
          >
            {/* Chat Header */}
            <div className="flex-none flex justify-between items-center px-4 py-5 bg-white relative">
              <h2 className="text-[18px] w-full font-medium text-[#111] text-center">Dəstək xidməti</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-[5px] border border-[#E7E7E7] bg-[#FAFAFA] flex items-center justify-center rounded-[8px] hover:bg-gray-100 absolute top-3 right-4 hover:scale-105 transition-all duration-200 hover:cursor-pointer"
              >
                <IoClose size={32} className="text-[#111]" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-6 bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.isUser ? "items-end" : "items-start"
                  }`}
                >
                  {!msg.isUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src={msg.avatar || 'default-avatar.png'} 
                          alt={msg.sender}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{msg.sender}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`max-w-[280px] p-3 rounded-[16px] ${
                        msg.isUser
                          ? "bg-[#2E92A0] text-white rounded-tr-none"
                          : "bg-[#F5F5F5] text-[#111] rounded-tl-none"
                      }`}
                    >
                      <p className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.time).toLocaleString('az-AZ', {
                        weekday: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Section */}
            <div className="flex-none bg-white">
              {/* Like/Dislike */}
              

              {/* Chat Input */}
              <div className="px-4 py-3 border-t border-[#F5F5F5]">
                <form onSubmit={submit} className="flex items-center gap-2 bg-[white] rounded-[8px] border border-[#E7E7E7]">
                  <input
                    type="text"
                    placeholder="Mesajınızı yazın"
                    className="flex-1  rounded-full pl-4 py-3 text-[15px] focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex items-center">
                    <button 
                      type="button"
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <LuLink size={22} className="text-[#111]" />
                    </button>
                    <button 
                      type="submit"
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      <VscSend size={22} className="text-[#111]" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot; 