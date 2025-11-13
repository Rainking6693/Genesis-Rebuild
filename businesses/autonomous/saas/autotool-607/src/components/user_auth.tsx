// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  // ... other user properties
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
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as User;
        return decoded;
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('authToken');
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token) as User;
      setUser(decoded);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Error decoding token during login:", error);
      // Handle invalid token
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

export const LoginForm: React.FC = () => {
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
      setLoginError("An unexpected error occurred.");
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
};

export const RegistrationForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setRegistrationError(errorData.message || 'Registration failed');
        return;
      }

      // Registration successful - maybe redirect or show success message
      setRegistrationError(null);
      alert("Registration successful!");

    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {registrationError && <div style={{ color: 'red' }}>{registrationError}</div>}
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
      <button type="submit">Register</button>
    </form>
  );
};

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  // ... other user properties
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
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as User;
        return decoded;
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('authToken');
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decoded = jwtDecode(token) as User;
      setUser(decoded);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Error decoding token during login:", error);
      // Handle invalid token
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

export const LoginForm: React.FC = () => {
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
      setLoginError("An unexpected error occurred.");
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
};

export const RegistrationForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setRegistrationError(errorData.message || 'Registration failed');
        return;
      }

      // Registration successful - maybe redirect or show success message
      setRegistrationError(null);
      alert("Registration successful!");

    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {registrationError && <div style={{ color: 'red' }}>{registrationError}</div>}
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
      <button type="submit">Register</button>
    </form>
  );
};