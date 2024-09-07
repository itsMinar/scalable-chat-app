'use client';

import {
  createContext,
  type FC,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { io } from 'socket.io-client';

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
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
  const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
    console.log('Send Message', msg);
  }, []);

  useEffect(() => {
    const _socket = io('http://localhost:4000');

    return () => {
      _socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
