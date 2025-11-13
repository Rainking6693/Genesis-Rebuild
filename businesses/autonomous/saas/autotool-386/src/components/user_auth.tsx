// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Assuming React Router is used
import { sha256 } from 'js-sha256'; // For password hashing
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface User {
  id: string;
  username: string;
  passwordHash: string;
  // Add other user properties as needed
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }

      // Hash the password
      const passwordHash = sha256(password);

      // Generate a unique user ID
      const userId = uuidv4();

      // Create a new user object
      const newUser: User = {
        id: userId,
        username: username,
        passwordHash: passwordHash,
      };

      // Simulate saving the user to a database (replace with actual API call)
      // In a real application, you would send this data to your backend API
      console.log('Registering user:', newUser);

      // For demonstration purposes, store the user in local storage
      localStorage.setItem('user', JSON.stringify(newUser));

      // Redirect to a protected route (e.g., dashboard)
      history.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }

      // Retrieve user from local storage (replace with actual API call)
      const storedUserString = localStorage.getItem('user');
      if (!storedUserString) {
        setError('Invalid username or password.');
        return;
      }

      const storedUser: User = JSON.parse(storedUserString);

      // Hash the entered password and compare it to the stored hash
      const passwordHash = sha256(password);
      if (storedUser.username !== username || storedUser.passwordHash !== passwordHash) {
        setError('Invalid username or password.');
        return;
      }

      // Simulate successful login (replace with actual token storage)
      console.log('Login successful!');

      // Redirect to a protected route (e.g., dashboard)
      history.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Assuming React Router is used
import { sha256 } from 'js-sha256'; // For password hashing
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

interface User {
  id: string;
  username: string;
  passwordHash: string;
  // Add other user properties as needed
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }

      // Hash the password
      const passwordHash = sha256(password);

      // Generate a unique user ID
      const userId = uuidv4();

      // Create a new user object
      const newUser: User = {
        id: userId,
        username: username,
        passwordHash: passwordHash,
      };

      // Simulate saving the user to a database (replace with actual API call)
      // In a real application, you would send this data to your backend API
      console.log('Registering user:', newUser);

      // For demonstration purposes, store the user in local storage
      localStorage.setItem('user', JSON.stringify(newUser));

      // Redirect to a protected route (e.g., dashboard)
      history.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!username || !password) {
        setError('Username and password are required.');
        return;
      }

      // Retrieve user from local storage (replace with actual API call)
      const storedUserString = localStorage.getItem('user');
      if (!storedUserString) {
        setError('Invalid username or password.');
        return;
      }

      const storedUser: User = JSON.parse(storedUserString);

      // Hash the entered password and compare it to the stored hash
      const passwordHash = sha256(password);
      if (storedUser.username !== username || storedUser.passwordHash !== passwordHash) {
        setError('Invalid username or password.');
        return;
      }

      // Simulate successful login (replace with actual token storage)
      console.log('Login successful!');

      // Redirect to a protected route (e.g., dashboard)
      history.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>User Authentication</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
    </div>
  );
};

export default UserAuth;