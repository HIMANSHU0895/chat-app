import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import queryString from 'query-string';
import './Chat.css';

let socket;

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { search } = useLocation();
  const { name, room } = queryString.parse(search);

  useEffect(() => {
    socket = io('http://localhost:3000');

    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });

    return () => {
      socket.disconnect();
    };
  }, [name, room]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="chat-container">
  <h2>Room: {room}</h2>
  <div className="messages">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`message-box ${
          msg.user === name ? 'my-message' : msg.user === 'admin' ? 'admin-message' : 'other-message'
        }`}
      >
        <strong>{msg.user}: </strong> {msg.text}
      </div>
    ))}
  </div>
  <form onSubmit={sendMessage} className="message-form">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message"
    />
    <button type="submit">Send</button>
  </form>
</div>

  );
};

export default Chat;
