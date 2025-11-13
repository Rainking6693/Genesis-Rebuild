// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // For password hashing
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs

interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

const UserAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      // Input validation
      if (!username || !password || !email) {
        throw new Error('All fields are required.');
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format.');
      }

      // Password strength validation (example)
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate a unique user ID
      const userId = uuidv4();

      // Simulate saving the user to a database (replace with actual database call)
      const newUser: User = {
        id: userId,
        username: username,
        passwordHash: passwordHash,
        email: email,
      };

      // In a real application, you would save 'newUser' to your database here.
      console.log('New user registered:', newUser);

      // Redirect to login page
      navigate('/login');

    } catch (err: any) {
      setError(err.message);
      console.error('Registration error:', err); // Log the error for debugging
    }
  };

  const loginUser = async () => {
    try {
      // Input validation
      if (!username || !password) {
        throw new Error('Username and password are required.');
      }

      // Simulate fetching user from database (replace with actual database call)
      // In a real application, you would fetch the user from your database based on the username.
      const storedUser: User | undefined = {
        id: 'some-user-id', // Replace with actual user ID from database
        username: username,
        passwordHash: '$2a$10$fakeHashedPassword', // Replace with actual hashed password from database
        email: 'test@example.com'
      };

      if (!storedUser) {
        throw new Error('Invalid username or password.');
      }

      // Compare the password with the stored hash
      const isMatch = await bcrypt.compare(password, storedUser.passwordHash);

      if (!isMatch) {
        throw new Error('Invalid username or password.');
      }

      // Simulate setting authentication token (replace with actual token generation and storage)
      localStorage.setItem('authToken', 'fake-auth-token');

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err); // Log the error for debugging
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h2>Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={registerUser}>Register</button>

      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default UserAuth;