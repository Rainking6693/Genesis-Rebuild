// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  id: number;
  username: string;
  passwordHash: string;
}

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'; // Store in env variable in production

function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const registerUser = async () => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      // Simulate database interaction (replace with actual database call)
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        setMessage('Username already exists.');
        return;
      }

      const newUser: User = {
        id: users.length + 1,
        username,
        passwordHash,
      };
      users.push(newUser);
      setMessage('Registration successful!');
    } catch (error: any) {
      console.error('Registration error:', error);
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  const loginUser = async () => {
    try {
      const user = users.find(user => user.username === username);
      if (!user) {
        setMessage('Invalid username or password.');
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        setMessage('Invalid username or password.');
        return;
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      setMessage(`Login successful! Token: ${token}`);
      localStorage.setItem('token', token); // Store token in local storage
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(`Login failed: ${error.message}`);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setMessage('Logged out successfully.');
  };

  return (
    <div>
      <h2>User Authentication</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={registerUser}>Register</button>
      <button onClick={loginUser}>Login</button>
      <button onClick={logoutUser}>Logout</button>
      <p>{message}</p>
    </div>
  );
}

// Mock user database (replace with actual database)
const users: User[] = [];

export default UserAuth;