import { useState } from 'react';

const UserList = ({ users, selectedUser, onSelectUser, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term and exclude admin users
  const filteredUsers = users
    .filter(user => user.name.toLowerCase() !== 'admin') // Skip admin users
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col border-r border-[#E7E7E7]">
      {/* Header */}
      <div className="p-4 bg-[#F5F5F5] border-b border-[#E7E7E7]">
        <h2 className="text-lg font-semibold text-[#3F3F3F]">İstifadəçilər</h2>
        
        {/* Search box */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="İstifadəçi axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-[#E7E7E7] rounded-lg text-sm focus:outline-none focus:border-[#2E92A0]"
          />
        </div>
      </div>
      
      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">İstifadəçi tapılmadı</div>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`
                flex items-center p-4 cursor-pointer border-b border-[#E7E7E7] hover:bg-[#F5F5F5]
                ${selectedUser?.id === user.id ? 'bg-[#F5F5F5]' : ''}
              `}
            >
              {/* User avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#2E92A0] flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {onlineUsers.includes(user.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              {/* User info */}
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-[#3F3F3F]">{user.name}</h3>
                  {user.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {new Date(user.lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                </div>
                
                {user.lastMessage && (
                  <p className="text-sm text-gray-500 truncate max-w-[180px]">
                    {user.unreadCount > 0 ? (
                      <span className="font-semibold">{user.lastMessage.message}</span>
                    ) : (
                      user.lastMessage.message
                    )}
                  </p>
                )}
              </div>
              
              {/* Unread count */}
              {user.unreadCount > 0 && (
                <div className="w-5 h-5 bg-[#2E92A0] rounded-full flex items-center justify-center text-white text-xs">
                  {user.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList; 