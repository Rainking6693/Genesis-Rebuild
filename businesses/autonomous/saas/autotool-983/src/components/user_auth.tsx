// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

const users: User[] = []; // In-memory user store (replace with database in production)

export const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password || !email) {
        throw new Error("All fields are required.");
      }

      if (users.find(user => user.username === username)) {
        throw new Error("Username already exists.");
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      users.push(newUser); // Store user in database here
      console.log("User registered:", newUser);
      setError(null);
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = users.find(user => user.username === username);

      if (!user) {
        throw new Error("Invalid username or password.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error("Invalid username or password.");
      }

      setLoggedInUser(user);
      setError(null);
      setUsername('');
      setPassword('');
      console.log("User logged in:", user);

    } catch (err: any) {
      setError(err.message || "Login failed.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    console.log("User logged out");
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loggedInUser ? (
        <div>
          <p>Welcome, {loggedInUser.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
      )}
    </div>
  );
};

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

const users: User[] = []; // In-memory user store (replace with database in production)

export const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password || !email) {
        throw new Error("All fields are required.");
      }

      if (users.find(user => user.username === username)) {
        throw new Error("Username already exists.");
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      users.push(newUser); // Store user in database here
      console.log("User registered:", newUser);
      setError(null);
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = users.find(user => user.username === username);

      if (!user) {
        throw new Error("Invalid username or password.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new Error("Invalid username or password.");
      }

      setLoggedInUser(user);
      setError(null);
      setUsername('');
      setPassword('');
      console.log("User logged in:", user);

    } catch (err: any) {
      setError(err.message || "Login failed.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    console.log("User logged out");
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {loggedInUser ? (
        <div>
          <p>Welcome, {loggedInUser.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
      )}
    </div>
  );
};