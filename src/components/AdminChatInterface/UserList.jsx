const UserList = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#E7E7E7]">
        <h2 className="font-semibold">Users</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`w-full p-4 hover:bg-[#F5F5F5] flex items-center ${
              selectedUser?.id === user.id ? 'bg-[#F5F5F5]' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#2E92A0] flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList; 