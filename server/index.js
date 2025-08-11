import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { addUser, removeUser, getUserInRoom } from './utils/users.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} joined` });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUserInRoom(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
    }
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} left` });
    }
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
