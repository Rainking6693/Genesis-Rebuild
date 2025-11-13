// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs'; // Simulate backend password hashing
import { ErrorBoundary } from 'react-error-boundary';

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default function UserAuth() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate backend authentication
      const simulatedUser = {
        id: '123',
        email: data.email,
        passwordHash: bcrypt.hashSync(data.password, 10), // Simulate hashing
      };

      // Simulate checking user credentials (replace with actual backend call)
      if (data.email === 'test@example.com' && bcrypt.compareSync(data.password, simulatedUser.passwordHash)) {
        setUser(simulatedUser);
      } else {
        throw new Error('Invalid credentials');
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so that any errors don't persist
      }}
    >
      <div>
        <h2>User Authentication</h2>

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
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </form>
        )}
      </div>
    </ErrorBoundary>
  );
}

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs'; // Simulate backend password hashing
import { ErrorBoundary } from 'react-error-boundary';

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default function UserAuth() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate backend authentication
      const simulatedUser = {
        id: '123',
        email: data.email,
        passwordHash: bcrypt.hashSync(data.password, 10), // Simulate hashing
      };

      // Simulate checking user credentials (replace with actual backend call)
      if (data.email === 'test@example.com' && bcrypt.compareSync(data.password, simulatedUser.passwordHash)) {
        setUser(simulatedUser);
      } else {
        throw new Error('Invalid credentials');
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so that any errors don't persist
      }}
    >
      <div>
        <h2>User Authentication</h2>

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
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </form>
        )}
      </div>
    </ErrorBoundary>
  );
}

Now, I will use the `Write` tool to save the code to a file.