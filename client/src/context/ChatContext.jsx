import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token },
      withCredentials: true
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('active_chats', (chats) => {
      setActiveChats(chats);
    });

    socket.on('new_customer', (customerId) => {
      setActiveChats(prev => [...prev, customerId]);
    });

    socket.on('customer_disconnected', (customerId) => {
      setActiveChats(prev => prev.filter(id => id !== customerId));
    });

    socket.on('new_message', (data) => {
      if (currentChat?.customerId !== data.customerId) {
        setUnreadCount(prev => prev + 1);
      }
      setMessages(prev => [...prev, data.message]);
    });

    return () => {
      socket.off('active_chats');
      socket.off('new_customer');
      socket.off('customer_disconnected');
      socket.off('new_message');
    };
  }, [socket, currentChat]);

  const joinChat = (customerId) => {
    setCurrentChat({ customerId });
    setMessages([]);
    setUnreadCount(0);
    // Load chat history from API if needed
  };

  const sendMessage = (text) => {
    if (!socket || !text.trim()) return;

    if (currentChat) {
      // Support agent sending to customer
      socket.emit('support_message', {
        customerId: currentChat.customerId,
        text
      });
    } else {
      // Customer sending to support
      socket.emit('customer_message', { text });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        activeChats,
        currentChat,
        messages,
        unreadCount,
        joinChat,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);