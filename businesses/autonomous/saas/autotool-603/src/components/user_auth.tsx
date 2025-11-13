// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken: User = jwtDecode(storedToken);
        return decodedToken;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decodedToken: User = jwtDecode(token);
      setUser(decodedToken);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token (e.g., show an error message)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Login failed');
        return;
      }

      const result = await response.json();
      login(result.token); // Assuming the API returns a token
      setLoginError(null);

    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register("email", { required: "Email is required" })} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" {...register("password", { required: "Password is required" })} />
        {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export function LogoutButton() {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
}

// Example API endpoint (mock)
// pages/api/login.ts
// This is just a placeholder and should be replaced with actual server-side logic
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Simulate authentication (replace with actual authentication logic)
    if (email === 'test@example.com' && password === 'password') {
      // Simulate token generation (replace with actual token generation logic)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY3ODg4NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with a real JWT
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken: User = jwtDecode(storedToken);
        return decodedToken;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decodedToken: User = jwtDecode(token);
      setUser(decodedToken);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle invalid token (e.g., show an error message)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Login failed');
        return;
      }

      const result = await response.json();
      login(result.token); // Assuming the API returns a token
      setLoginError(null);

    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register("email", { required: "Email is required" })} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" {...register("password", { required: "Password is required" })} />
        {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

export function LogoutButton() {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
}

// Example API endpoint (mock)
// pages/api/login.ts
// This is just a placeholder and should be replaced with actual server-side logic
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Simulate authentication (replace with actual authentication logic)
    if (email === 'test@example.com' && password === 'password') {
      // Simulate token generation (replace with actual token generation logic)
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTY3ODg4NjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with a real JWT
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}