import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', { transports: ['websocket'] });

const UserBid = () => {
  const [currentBid, setCurrentBid] = useState(0);
  const [userBid, setUserBid] = useState('');
  const [username, setUsername] = useState('');
  const [itemName, setItemName] = useState('');
  const [userList, setUserList] = useState([]);
  const [bidList, setBidList] = useState([]);
  const [highestBid, setHighestBid] = useState(null);
  const [confirmedBid, setConfirmedBid] = useState(null);

  useEffect(() => {
    socket.on('userList', (list) => {
      setUserList(list);
    });

    socket.on('bidList', (list) => {
      setBidList(list);
      updateHighestBid(list);
    });

    socket.on('confirmedBid', (bid) => {
      setConfirmedBid(bid);
      setHighestBid(null);
      setCurrentBid(0);
    });

    socket.on('currentBid', (bidAmount) => {
      setCurrentBid(bidAmount);
    });

    socket.on('createdBid', (newBid) => {
      console.log('New bid created:', newBid);
      setBidList((prevBids) => [
        ...prevBids,
        { ...newBid, showConfirmButton: username === 'User 1' },
      ]);
    });

    socket.emit('getCurrentBid');
  }, [username]);

  const updateHighestBid = (bidList) => {
    const highest = bidList.reduce((prev, current) => (prev.bidAmount > current.bidAmount ? prev : current), {});
    setHighestBid(highest);
  };

  const handleSetUsername = () => {
    if (username) {
      socket.emit('setUsername', username);
    }
  };

  const handlePlaceBid = () => {
    if (userBid && !isNaN(userBid) && itemName) {
      const newBid = {
        username,
        bidAmount: parseInt(userBid),
        itemName,
        status: 'open',
        showConfirmButton: false,
      };
      socket.emit('newBid', newBid);
      setUserBid('');
      setItemName('');
    }
  };

  const handleConfirmBid = (bidId) => {
    socket.emit('confirmBid', bidId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Car Bidding</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border p-3 rounded mr-2 w-64"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          className="border p-3 rounded mr-2 w-64"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          onClick={handleSetUsername}
        >
          Set Username
        </button>
      </div>
      <div className="mb-6">
        <p className="text-lg">Your Bid: ${userBid}</p>
        <div className="flex">
          <input
            type="text"
            className="border p-3 rounded mr-2 w-64"
            placeholder="Enter your bid"
            value={userBid}
            onChange={(e) => setUserBid(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            onClick={handlePlaceBid}
          >
            Place Bid
          </button>
        </div>
      </div>
      <div className="mb-6 flex">
        <p className="text-lg">Users Online:</p>
        <ul>
          {userList.map((user) => (
            <li key={user} className="text-gray-800 text-lg ml-3 font-bold">
              {user}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <p className="text-lg">Bid List:</p>
        <ul>
          {bidList.map((bid) => (
            <li key={bid.id} className="text-gray-800 mb-2">
              {bid.username} bid ${bid.bidAmount} for {bid.itemName}{' '}
              {bid.showConfirmButton && (
                <button
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray"
                  onClick={() => handleConfirmBid(bid.id)}
                >
                  Confirm Bid
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {highestBid && (
        <div className="mb-6">
          <p className="text-lg text-green-600">
            Highest Bid: {highestBid.username} bid ${highestBid.bidAmount} for {highestBid.itemName}
          </p>
        </div>
      )}
      {confirmedBid && (
        <div className="mb-6">
          <p className="text-lg text-green-600">Bid Sold: {confirmedBid.username} sold the bid for ${confirmedBid.bidAmount} on {confirmedBid.itemName}</p>
        </div>
      )}
      <div className="text-lg mt-4">Current Bid Amount: ${currentBid}</div>
    </div>
  );
};

export default UserBid;
