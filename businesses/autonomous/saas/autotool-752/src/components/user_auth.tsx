// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import bcrypt from 'bcryptjs'; // For password hashing
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs

interface User {
  id: string;
  username: string;
  passwordHash: string;
  // Add other user properties as needed
}

// In-memory user storage (replace with a database in a real application)
const users: User[] = [];

const saltRounds = 10; // For bcrypt

export default function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (e.g., by checking for a token in local storage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      // Check if username already exists
      if (users.find(user => user.username === username)) {
        throw new Error('Username already exists.');
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create a new user
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
      };

      users.push(newUser); // Store user (replace with database insertion)

      // Log the user in after registration
      localStorage.setItem('authToken', 'dummy_token'); // Replace with actual token generation
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      // Find the user
      const user = users.find(user => user.username === username);
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      // Compare the password
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error('Invalid username or password.');
      }

      // Log the user in
      localStorage.setItem('authToken', 'dummy_token'); // Replace with actual token generation
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!isLoggedIn ? (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>

          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <p>Logged in as {username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}