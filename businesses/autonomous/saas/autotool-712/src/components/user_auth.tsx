// src/components/UserAuth.tsx
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'; // Or similar auth library

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function UserAuth({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (type === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        }
      } else {
        // Simulate registration (replace with actual API call)
        if (email === 'test@example.com') {
          setError('Email already exists.');
          return;
        }
        console.log('Registering user:', email, password);
        // In a real application, you would send a request to your backend to create the user.
        // For this example, we'll just simulate success.
        alert('Registration successful!  (Simulated)');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    }
  };

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return <>{children}</>;
}

// src/components/UserAuth.tsx
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'; // Or similar auth library

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function UserAuth({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (type === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        }
      } else {
        // Simulate registration (replace with actual API call)
        if (email === 'test@example.com') {
          setError('Email already exists.');
          return;
        }
        console.log('Registering user:', email, password);
        // In a real application, you would send a request to your backend to create the user.
        // For this example, we'll just simulate success.
        alert('Registration successful!  (Simulated)');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    }
  };

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return <>{children}</>;
}

Now, I will use the tools to write the code and create the build report.