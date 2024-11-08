// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3001;

let bids = [];
let users = {};
let currentBid = 0;

const updateCurrentBid = () => {
  const newCurrentBid = Math.max(...bids.map((bid) => bid.bidAmount), 0);
  if (newCurrentBid !== currentBid) {
    currentBid = newCurrentBid;
    io.emit('currentBid', currentBid);
  }
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('currentBid', currentBid);
  socket.emit('bidList', bids);

  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    io.emit('userList', Object.values(users));
  });

  socket.on('newBid', (bid) => {
    bids.push({ ...bid, socketId: socket.id, status: 'open' });
    io.emit('bidList', bids);
    updateCurrentBid();
  });

  socket.on('placeBid', (bidId, newBidAmount, newUsername) => {
    const targetBidIndex = bids.findIndex((bid) => bid.id === bidId);
    if (targetBidIndex !== -1 && bids[targetBidIndex].status === 'open') {
      bids[targetBidIndex].bidAmount = newBidAmount;
      bids[targetBidIndex].username = newUsername;
      io.emit('bidList', bids);
      updateCurrentBid();
    }
  });

  socket.on('confirmBid', (bidId) => {
    const confirmedBid = bids.find((bid) => bid.id === bidId);
    if (confirmedBid) {
      confirmedBid.status = 'closed';
      io.emit('confirmedBid', confirmedBid);
      updateCurrentBid();
    }
  });

  socket.on('resetBid', () => {
    bids = [];
    io.emit('bidList', bids);
    currentBid = 0;
    io.emit('currentBid', currentBid);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete users[socket.id];
    io.emit('userList', Object.values(users));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
