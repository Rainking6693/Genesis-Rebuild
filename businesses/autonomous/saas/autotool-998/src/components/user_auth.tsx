// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // For password hashing (simplified example)

interface User {
  username: string;
  passwordHash: string;
}

const UserAuth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Hash the password (simplified example - use a proper auth service in production)
      const passwordHash = await bcrypt.hash(password, 10);

      // Simulate user creation (replace with database call in production)
      const newUser: User = { username, passwordHash };
      setUser(newUser); // Simulate successful registration
      setError(null);
      console.log("User registered successfully:", newUser);

    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Simulate user lookup (replace with database call in production)
      if (!user || user.username !== username) {
        throw new Error("Invalid username or password.");
      }

      // Verify password (simplified example - use a proper auth service in production)
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error("Invalid username or password.");
      }

      console.log("User logged in successfully:", user);
      setError(null);

    } catch (err: any) {
      setError(err.message || "Login failed.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out.");
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!user ? (
        <>
          <h3>Register</h3>
          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Register</button>
          </form>

          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // For password hashing (simplified example)

interface User {
  username: string;
  passwordHash: string;
}

const UserAuth: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Hash the password (simplified example - use a proper auth service in production)
      const passwordHash = await bcrypt.hash(password, 10);

      // Simulate user creation (replace with database call in production)
      const newUser: User = { username, passwordHash };
      setUser(newUser); // Simulate successful registration
      setError(null);
      console.log("User registered successfully:", newUser);

    } catch (err: any) {
      setError(err.message || "Registration failed.");
      console.error("Registration error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!username || !password) {
        throw new Error("Username and password are required.");
      }

      // Simulate user lookup (replace with database call in production)
      if (!user || user.username !== username) {
        throw new Error("Invalid username or password.");
      }

      // Verify password (simplified example - use a proper auth service in production)
      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error("Invalid username or password.");
      }

      console.log("User logged in successfully:", user);
      setError(null);

    } catch (err: any) {
      setError(err.message || "Login failed.");
      console.error("Login error:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out.");
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!user ? (
        <>
          <h3>Register</h3>
          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Register</button>
          </form>

          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">Login</button>
          </form>
        </>
      ) : (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default UserAuth;