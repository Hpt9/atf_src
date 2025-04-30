import { useState, useEffect, useRef } from 'react';
import { IoSend, IoAttach } from 'react-icons/io5';

const ChatWindow = ({ selectedUser, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onSendMessage(newMessage);
    setNewMessage('');
  };

  // If no user is selected, show an empty state
  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-medium text-[#3F3F3F]">Söhbət başlatmaq üçün bir istifadəçi seçin</h3>
          <p className="text-gray-500 mt-2">Soldakı siyahıdan bir istifadəçi seçin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 bg-[#F5F5F5] border-b border-[#E7E7E7] flex items-center">
        <div className="w-10 h-10 rounded-full bg-[#2E92A0] flex items-center justify-center text-white font-medium">
          {selectedUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-[#3F3F3F]">{selectedUser.name}</h3>
          <p className="text-xs text-gray-500">
            {selectedUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5F5]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Hələ mesaj yoxdur. Söhbətə başlamaq üçün bir mesaj göndər.</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Determine if message is from admin/support (response) or user (request)
            // Using both the type field and the isAdmin flag set in the parent component
            const isAdminMessage = msg.type === "response" || msg.isAdmin;
            
            return (
              <div
                key={msg.id}
                className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
              >
                {/* Message bubble with conditional styling */}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isAdminMessage
                      ? 'bg-[#2E92A0] text-white'
                      : 'bg-white text-[#3F3F3F]'
                  }`}
                >
                  <div>{msg.message}</div>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 bg-white border-t border-[#E7E7E7]">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-[#F5F5F5]"
          >
            <IoAttach size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yazın..."
            className="flex-1 py-2 px-4 border border-[#E7E7E7] rounded-full focus:outline-none focus:border-[#2E92A0]"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-[#2E92A0] text-white hover:bg-[#267A85] transition-colors"
          >
            <IoSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 