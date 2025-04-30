import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import UserList from './UserList';
import ChatWindow from './ChatWindow';

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

const AdminChatInterface = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Echo instance for realtime updates
  useEffect(() => {
    echoInstance = createEchoInstance();

    // Subscribe to the admin channel
    const adminChannel = echoInstance.private('admin.chat');
    
    // Listen for new messages
    adminChannel.listen('.new.message', (data) => {
      handleNewMessage(data.message);
    });
    
    // Listen for online status updates
    adminChannel.listen('.user.online', (data) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    });
    
    adminChannel.listen('.user.offline', (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    // Cleanup on unmount
    return () => {
      if (echoInstance) {
        echoInstance.leave('admin.chat');
        echoInstance.disconnect();
      }
    };
  }, []);

  // Fetch users with chat history
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://atfplatform.tw1.ru/api/support/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.users)) {
          // Transform the user data to include additional properties we need
          const formattedUsers = data.users.map(user => ({
            ...user,
            lastMessage: null,  // Will be populated when messages are loaded
            unreadCount: 0,     // Will be updated when new messages arrive
            isOnline: onlineUsers.includes(user.id)
          }));
          
          setUsers(formattedUsers);
        } else {
          throw new Error('Invalid response format');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [onlineUsers]);

  // Handle new message from websocket
  const handleNewMessage = (message) => {
    // Update messages if current chat is open
    if (selectedUser && message.user_id === selectedUser.id) {
      // Determine if this is an admin/support message by its type
      const isAdminMessage = message.type === "response";
      
      setMessages(prev => [...prev, {
        ...message,
        isAdmin: isAdminMessage
      }]);
    }
    
    // Update the users list with new message info
    setUsers(prev => {
      return prev.map(user => {
        if (user.id === message.user_id) {
          return {
            ...user,
            lastMessage: message,
            unreadCount: selectedUser?.id === user.id ? 0 : (user.unreadCount || 0) + 1,
          };
        }
        return user;
      });
    });
  };

  // Fetch messages when selecting a user
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    
    try {
      const response = await fetch(`https://atfplatform.tw1.ru/api/messages/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.messages)) {
        // Process each message to determine its type
        const formattedMessages = data.messages.map(msg => {
          // Determine if this is an admin/support message by its type
          const isAdminMessage = msg.type === "response";
          
          return {
            ...msg,
            isAdmin: isAdminMessage
          };
        });
        
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
      
      // Reset unread count for selected user
      setUsers(prev => 
        prev.map(u => u.id === user.id ? { ...u, unreadCount: 0 } : u)
      );
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
      setLoading(false);
    }
  };

  // Send message to user
  const handleSendMessage = async (messageText) => {
    if (!selectedUser) return;
    
    // Create temporary message to show immediately
    const tempMessage = {
      id: Date.now().toString(),
      message: messageText,
      user_id: null,
      support_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      type: "response",
      isAdmin: true // Admin message (response type)
    };
    
    // Add to messages immediately (optimistic update)
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const response = await fetch('https://atfplatform.tw1.ru/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          message: messageText,
          type: "response" // Explicitly set type as response
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Update the temp message with the real one
      if (data.status === 'success' && data.message) {
        const serverMessage = {
          ...data.message,
          isAdmin: true // Always mark admin messages (responses)
        };
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? serverMessage : msg
          )
        );
        
        // Update user's last message
        setUsers(prev => 
          prev.map(user => 
            user.id === selectedUser.id 
              ? { ...user, lastMessage: serverMessage } 
              : user
          )
        );
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temp message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-[#2E92A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#2E92A0] text-white p-4">
        <h1 className="text-2xl font-semibold">Admin Chat</h1>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Users sidebar - 1/3 width on larger screens, full on mobile */}
        <div className="w-full md:w-1/3 h-full">
          <UserList 
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onlineUsers={onlineUsers}
          />
        </div>
        
        {/* Chat window - 2/3 width on larger screens, hidden on mobile when no user is selected */}
        <div className="hidden md:block md:w-2/3 h-full">
          <ChatWindow 
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminChatInterface; 