// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const UserAuth = () => {
  const [state, setState] = useState(initialState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({...state, isLoading: true, error: null});

    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      if (username === 'existinguser') {
        throw new Error('Username already exists');
      }

      // Simulate successful registration
      setState({...state, isLoading: false, isAuthenticated: true});
      console.log('Registration successful');
    } catch (error: any) {
      setState({...state, isLoading: false, error: error.message});
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({...state, isLoading: true, error: null});

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      if (username !== 'testuser' || password !== 'password') {
        throw new Error('Invalid credentials');
      }

      // Simulate successful login
      setState({...state, isLoading: false, isAuthenticated: true});
      console.log('Login successful');
    } catch (error: any) {
      setState({...state, isLoading: false, error: error.message});
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setState({...state, isAuthenticated: false});
    console.log('Logged out');
  };

  return (
    <div>
      <h2>User Authentication</h2>

      {state.error && <div style={{ color: 'red' }}>Error: {state.error}</div>}

      {state.isAuthenticated ? (
        <div>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>Register</h3>
          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit" disabled={state.isLoading}>
              {state.isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit" disabled={state.isLoading}>
              {state.isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const UserAuth = () => {
  const [state, setState] = useState(initialState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({...state, isLoading: true, error: null});

    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      if (username === 'existinguser') {
        throw new Error('Username already exists');
      }

      // Simulate successful registration
      setState({...state, isLoading: false, isAuthenticated: true});
      console.log('Registration successful');
    } catch (error: any) {
      setState({...state, isLoading: false, error: error.message});
      console.error('Registration failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({...state, isLoading: true, error: null});

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      if (username !== 'testuser' || password !== 'password') {
        throw new Error('Invalid credentials');
      }

      // Simulate successful login
      setState({...state, isLoading: false, isAuthenticated: true});
      console.log('Login successful');
    } catch (error: any) {
      setState({...state, isLoading: false, error: error.message});
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setState({...state, isAuthenticated: false});
    console.log('Logged out');
  };

  return (
    <div>
      <h2>User Authentication</h2>

      {state.error && <div style={{ color: 'red' }}>Error: {state.error}</div>}

      {state.isAuthenticated ? (
        <div>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>Register</h3>
          <form onSubmit={handleRegister}>
            <label>
              Username:
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit" disabled={state.isLoading}>
              {state.isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <br />
            <button type="submit" disabled={state.isLoading}>
              {state.isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserAuth;