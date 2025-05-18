// src/components/chat/SupportDashboard.jsx
import { useChat } from '../../context/ChatContext';

const SupportDashboard = () => {
  const {
    activeChats,
    currentChat,
    messages,
    unreadCount,
    joinChat,
    sendMessage
  } = useChat();

  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="support-dashboard">
      <div className="chat-list">
        <h3>Active Chats ({activeChats.length})</h3>
        <ul>
          {activeChats.map((customerId) => (
            <li
              key={customerId}
              className={currentChat?.customerId === customerId ? 'active' : ''}
              onClick={() => joinChat(customerId)}
            >
              Customer {customerId.slice(0, 6)}
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {currentChat ? (
          <>
            <h4>Chat with Customer {currentChat.customerId.slice(0, 6)}</h4>
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.sender === currentChat.customerId ? 'received' : 'sent'}`}>
                  <p>{msg.text}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your reply..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a chat from the list</p>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;