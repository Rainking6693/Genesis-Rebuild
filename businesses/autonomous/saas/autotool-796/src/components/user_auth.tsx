// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

const UserAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call for authentication
      const response = await fakeLogin(username, password);

      if (response.success) {
        setUser(response.user);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const fakeLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "testuser" && password === "password") {
          const user: User = {
            id: "123",
            username: "testuser",
            email: "test@example.com",
          };
          resolve({ success: true, user: user });
        } else {
          resolve({ success: false, message: "Invalid username or password" });
        }
      }, 500);
    });
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

const UserAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call for authentication
      const response = await fakeLogin(username, password);

      if (response.success) {
        setUser(response.user);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const fakeLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "testuser" && password === "password") {
          const user: User = {
            id: "123",
            username: "testuser",
            email: "test@example.com",
          };
          resolve({ success: true, user: user });
        } else {
          resolve({ success: false, message: "Invalid username or password" });
        }
      }, 500);
    });
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserAuth;