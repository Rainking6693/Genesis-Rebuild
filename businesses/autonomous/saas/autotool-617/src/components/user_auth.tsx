// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

interface User {
  id: string;
  username: string;
  email: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'secret'; // Use environment variable for production

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        setUser({ id: decoded.userId, username: decoded.username, email: decoded.email });
        navigate('/dashboard'); // Redirect to dashboard if already logged in
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, [navigate, JWT_SECRET]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simulate API call to register user (replace with actual API endpoint)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser({ id: data.userId, username, email: data.email });
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to login user (replace with actual API endpoint)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      const isPasswordValid = await bcrypt.compare(password, data.hashedPassword);

      if (!isPasswordValid) {
          throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: data.userId, username: data.username, email: data.email }, JWT_SECRET, { expiresIn: '1h' });
      localStorage.setItem('token', token);
      setUser({ id: data.userId, username: data.username, email: data.email });
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
          </form>

          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

interface User {
  id: string;
  username: string;
  email: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || 'secret'; // Use environment variable for production

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        setUser({ id: decoded.userId, username: decoded.username, email: decoded.email });
        navigate('/dashboard'); // Redirect to dashboard if already logged in
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, [navigate, JWT_SECRET]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simulate API call to register user (replace with actual API endpoint)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser({ id: data.userId, username, email: data.email });
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to login user (replace with actual API endpoint)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      const isPasswordValid = await bcrypt.compare(password, data.hashedPassword);

      if (!isPasswordValid) {
          throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: data.userId, username: data.username, email: data.email }, JWT_SECRET, { expiresIn: '1h' });
      localStorage.setItem('token', token);
      setUser({ id: data.userId, username: data.username, email: data.email });
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
          </form>

          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserAuth;