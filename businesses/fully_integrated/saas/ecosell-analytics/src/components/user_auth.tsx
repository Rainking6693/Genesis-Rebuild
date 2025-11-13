import React, { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

interface Props {
  message: string;
}

interface User {
  id: number;
  email: string;
  role: string;
  exp: number;
}

const UserAuth: FC<Props> = ({ message }) => {
  const [cookies, setCookies] = useCookies(['token']);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = () => {
    if (cookies.token) {
      const decoded = jwtDecode<User>(cookies.token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      setUser(decoded);
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const token = response.data.token;
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30};`; // Set cookie for 30 days
      setUser(jwtDecode<User>(token));
      return true;
    } catch (error) {
      console.error(error);
      setError('Invalid email or password');
      return false;
    }
  };

  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
  };

  const handleKeyDown = (event: React.FormEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const email = event.currentTarget.querySelector('input[name="email"]') as HTMLInputElement;
      const password = event.currentTarget.querySelector('input[name="password"]') as HTMLInputElement;
      login(email.value, password.value);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    return <div className="error">{error}</div>;
  };

  if (isAuthenticated()) {
    return (
      <div className="authenticated-user">
        {message}
        {/* Add other authenticated user components here */}
        {user && <div>Welcome, {user.email}! (Role: {user.role})</div>}
      </div>
    );
  }

  return (
    <div className="unauthenticated-user">
      {message}
      {getErrorMessage()}
      <form onSubmit={(e) => {
        handleKeyDown(e);
      }} onKeyDown={handleKeyDown}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserAuth;

In this updated version, I've added a `handleKeyDown` function to handle the Enter key press for the login form, making it more accessible. I've also extracted the error message rendering logic into a separate function `getErrorMessage` for better maintainability.