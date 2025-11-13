// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Simulate user creation (replace with actual database interaction)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        username: username,
        passwordHash: passwordHash,
      };

      // Simulate saving the user to a database (replace with actual database interaction)
      // In a real application, you would save the user to a database here.
      console.log("Registered user:", newUser);

      setUser(newUser);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Simulate user lookup (replace with actual database interaction)
      // In a real application, you would query the database for the user.
      const storedUser: User = {
        id: 'some-user-id',
        username: 'testuser',
        passwordHash: '$2a$10$exampleHashedPassword', // Example hashed password
      };

      // Simulate password verification (replace with actual bcrypt.compare)
      const passwordMatch = await bcrypt.compare(password, storedUser.passwordHash);

      if (username !== storedUser.username || !passwordMatch) {
        throw new Error("Invalid username or password.");
      }

      setUser(storedUser);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <h2>User Authentication</h2>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>Register</h3>
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
          <button onClick={handleRegister}>Register</button>

          <h3>Login</h3>
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
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Simulate user creation (replace with actual database interaction)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        username: username,
        passwordHash: passwordHash,
      };

      // Simulate saving the user to a database (replace with actual database interaction)
      // In a real application, you would save the user to a database here.
      console.log("Registered user:", newUser);

      setUser(newUser);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Simulate user lookup (replace with actual database interaction)
      // In a real application, you would query the database for the user.
      const storedUser: User = {
        id: 'some-user-id',
        username: 'testuser',
        passwordHash: '$2a$10$exampleHashedPassword', // Example hashed password
      };

      // Simulate password verification (replace with actual bcrypt.compare)
      const passwordMatch = await bcrypt.compare(password, storedUser.passwordHash);

      if (username !== storedUser.username || !passwordMatch) {
        throw new Error("Invalid username or password.");
      }

      setUser(storedUser);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <h2>User Authentication</h2>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>Register</h3>
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
          <button onClick={handleRegister}>Register</button>

          <h3>Login</h3>
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
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;