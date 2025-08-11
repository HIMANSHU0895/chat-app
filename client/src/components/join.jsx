import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) navigate(`/chat?name=${name}&room=${room}`);
  };

  return (
    <div>
      <h2>Join Chat</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Join;
