// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const handleRegister = async () => {
    try {
      // Input validation
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

      // Store the user (replace with actual database interaction)
      // For demonstration, we'll just log the new user
      console.log("New user registered:", newUser);

      setUser(newUser);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      // Input validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Simulate user lookup (replace with actual database interaction)
      // For demonstration, we'll assume a user exists with the same username
      // and password (after hashing)
      if (!user || user.username !== username) {
        throw new Error("Invalid username or password.");
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        throw new Error("Invalid username or password.");
      }

      // Set the user (replace with actual authentication logic)
      console.log("User logged in:", user);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    // Simulate logout (replace with actual authentication logic)
    setUser(null);
    console.log("User logged out.");
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

          <h2>Login</h2>
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