// src/components/UserAuth.tsx

import { useState } from 'react';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory user store (replace with database)

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Use environment variable in production

export function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        throw new Error('Username already exists.');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        username,
        passwordHash,
      };
      users.push(newUser);

      setError('');
      alert('Registration successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      const user = users.find((user) => user.username === username);
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error('Invalid username or password.');
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
      });
      setToken(token);
      setError('');
      alert('Login successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    alert('Logged out!');
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      {token && <button onClick={handleLogout}>Logout</button>}
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default UserAuth;

// src/components/UserAuth.tsx

import { useState } from 'react';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const users: User[] = []; // In-memory user store (replace with database)

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Use environment variable in production

export function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        throw new Error('Username already exists.');
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        username,
        passwordHash,
      };
      users.push(newUser);

      setError('');
      alert('Registration successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      const user = users.find((user) => user.username === username);
      if (!user) {
        throw new Error('Invalid username or password.');
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error('Invalid username or password.');
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
      });
      setToken(token);
      setError('');
      alert('Login successful!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    alert('Logged out!');
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      {token && <button onClick={handleLogout}>Logout</button>}
      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default UserAuth;