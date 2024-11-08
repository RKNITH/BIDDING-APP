// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const loginSuccess = await onLogin(username, password);

    if (loginSuccess) {
      navigate('/user-bid');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          className="w-full p-2 border rounded-md"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={handleLogin}
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <p className="mt-4">
        Don't have an account?{' '}
        <Link to='/register'>
          <span
            className="cursor-pointer text-blue-500"
            onClick={onSwitchToRegister}
          >
            Register
          </span>
        </Link>
      </p>
    </div>
  );
};

export default Login;
