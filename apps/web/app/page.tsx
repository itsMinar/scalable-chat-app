'use client';

import { useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import classes from './page.module.css';

export default function HomePage() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState('');

  return (
    <div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className={classes['chat-input']}
          placeholder="Message..."
        />
        <button
          onClick={() => sendMessage(message)}
          className={classes['button']}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((e, idx) => (
          <li key={idx}>{e}</li>
        ))}
      </div>
    </div>
  );
}
