const { useState, useEffect, useRef } = React;

function ChatApp() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (username) {
      initializeRoom();
    }
  }, [username]);
  
  useEffect(() => {
    scrollToBottom();
  }, [room?.collection('message').getList()]);
  
  const initializeRoom = async () => {
    const websimRoom = new WebsimSocket();
    await websimRoom.initialize();
    
    websimRoom.updatePresence({
      status: 'online',
      lastActive: new Date().toISOString()
    });
    
    setRoom(websimRoom);
  };
  
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput);
      setShowJoinModal(false);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && room) {
      await room.collection('message').create({
        text: message,
        timestamp: new Date().toISOString()
      });
      setMessage('');
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get messages and online users
  const messages = room ? room.collection('message').getList() : [];
  const onlineUsers = room ? Object.values(room.peers) : [];
  
  return (
    <>
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Join BookingJini Chat</h2>
            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-btn primary">Join Chat</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="chat-container">
        <div className="sidebar">
          <div className="logo">BookingJini</div>
          {username && (
            <div className="user-info">
              <img 
                src={`https://images.websim.ai/avatar/${username}`} 
                alt={username} 
                className="avatar" 
              />
              <span className="username">{username}</span>
            </div>
          )}
          <div className="online-users">
            <h3>Online Users ({onlineUsers.length})</h3>
            <ul className="user-list">
              {onlineUsers.map((user) => (
                <li className="user-item" key={user.id}>
                  <span className="user-status"></span>
                  <img 
                    src={user.avatarUrl} 
                    alt={user.username} 
                    className="avatar" 
                  />
                  <span className="username">{user.username}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="chat-area">
          <div className="chat-header">
            <div className="room-info">
              <h2>BookingJini Chat Room</h2>
              <p>{onlineUsers.length} users online</p>
            </div>
            <div className="header-actions">
              <button title="Settings">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </div>
          
          <div className="messages-container">
            {messages.map((msg, index) => {
              const isCurrentUser = msg.username === username;
              return (
                <div 
                  key={msg.id} 
                  className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                >
                  <div className="message-info">
                    <span className="message-sender">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!room}
              />
              <button type="submit" disabled={!room}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<ChatApp />, document.getElementById('root'));