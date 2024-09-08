'use client';

import {
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}

// Create a context for socket functionality, initialized with null
const SocketContext = createContext<ISocketContext | null>(null);

// Custom hook to access the SocketContext value
export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) {
    throw new Error('state is undefined');
  }

  return state;
};

// SocketProvider component that will wrap parts of the app
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext['sendMessage'] = useCallback(
    (msg) => {
      console.log('Send Message', msg);
      if (socket) {
        socket.emit('event:message', { message: msg });
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((msg: string) => {
    console.log('🚀 ~ From Server Message Received:', msg);
    const { message } = JSON.parse(msg) as { message: string };
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  useEffect(() => {
    const _socket = io('http://localhost:4000');
    _socket.on('message', onMessageReceived);
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off('message', onMessageReceived);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
