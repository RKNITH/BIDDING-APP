import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserBid from './components/UserBid';

const App = () => {
 
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserBid  />}
        />

      </Routes>
    </Router>
  );
};

export default App;
