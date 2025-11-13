// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For JWT tokens

interface User {
  id: string;
  username: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Replace with a strong, environment-specific secret

function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
        setUser(decoded.user);
        setIsLoggedIn(true);
        navigate('/dashboard'); // Redirect to dashboard if already logged in
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem('token'); // Remove invalid token
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password || !email) {
        throw new Error("All fields are required.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simulate API call to register user (replace with actual API call)
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setError(null);
      // Automatically log in after registration
      handleLogin(e);

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to login user (replace with actual API call)
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();

      // Verify password (replace with server-side verification in production)
      const passwordMatch = await bcrypt.compare(password, data.hashedPassword);

      if (!passwordMatch) {
          throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ user: { id: data.id, username: data.username, email: data.email } }, JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });

      // Store token in local storage
      localStorage.setItem('token', token);

      setUser({ id: data.id, username: data.username, email: data.email });
      setIsLoggedIn(true);
      setError(null);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/'); // Redirect to home page
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
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For JWT tokens

interface User {
  id: string;
  username: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Replace with a strong, environment-specific secret

function UserAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
        setUser(decoded.user);
        setIsLoggedIn(true);
        navigate('/dashboard'); // Redirect to dashboard if already logged in
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem('token'); // Remove invalid token
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password || !email) {
        throw new Error("All fields are required.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simulate API call to register user (replace with actual API call)
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed.");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setError(null);
      // Automatically log in after registration
      handleLogin(e);

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call to login user (replace with actual API call)
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();

      // Verify password (replace with server-side verification in production)
      const passwordMatch = await bcrypt.compare(password, data.hashedPassword);

      if (!passwordMatch) {
          throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ user: { id: data.id, username: data.username, email: data.email } }, JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });

      // Store token in local storage
      localStorage.setItem('token', token);

      setUser({ id: data.id, username: data.username, email: data.email });
      setIsLoggedIn(true);
      setError(null);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/'); // Redirect to home page
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
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserAuth;