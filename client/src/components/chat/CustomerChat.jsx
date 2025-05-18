import { useChat } from '../../context/ChatContext';

const CustomerChat = () => {
  const { messages, sendMessage } = useChat();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };


  return (
    <div className="chat-container">
      <h3>Customer Support</h3>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'support' ? 'received' : 'sent'}`}>
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
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default CustomerChat;