// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  // ... other user properties
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Replace with a secure secret in production

function UserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call for authentication
      const response = await fakeAuthApi(data.email, data.password);

      if (response.success) {
        const user: User = { id: '123', email: data.email }; // Replace with actual user data
        setUser(user);

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        localStorage.setItem('token', token); // Store token securely (e.g., httpOnly cookie)
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

// Simulate a fake authentication API call
async function fakeAuthApi(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
}

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  // ... other user properties
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Replace with a secure secret in production

function UserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call for authentication
      const response = await fakeAuthApi(data.email, data.password);

      if (response.success) {
        const user: User = { id: '123', email: data.email }; // Replace with actual user data
        setUser(user);

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        localStorage.setItem('token', token); // Store token securely (e.g., httpOnly cookie)
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" {...register("email", { required: "Email is required" })} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" {...register("password", { required: "Password is required" })} />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

// Simulate a fake authentication API call
async function fakeAuthApi(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'test@example.com' && password === 'password') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
}

export default UserAuth;