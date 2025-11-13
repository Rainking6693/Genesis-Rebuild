import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

interface Props {}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginError: string | null;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface User {
  name: string;
  email: string;
}

const ReferralComponent: React.FC<Props> = () => {
  const { user, setUser, loginError, setLoginError } = useContext(UserContext);

  const handleLogin = () => {
    // Simulate user login logic here
    // Set user state and clear error
    fetch('https://api.example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'john.doe@example.com', password: 'password' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        setUser({ name: data.name, email: data.email });
        setLoginError(null);
      })
      .catch((error) => {
        setLoginError(error.message);
      });
  };

  if (!user) {
    return (
      <>
        <h1>Please log in to access the referral system.</h1>
        <button onClick={handleLogin}>Login</button>
        {loginError && <p>{loginError}</p>}
      </>
    );
  }

  return <h1>Hello, {user.name}! Welcome to Climate Pulse's Referral System.</h1>;
};

export default ReferralComponent;

import React, { createContext, useState } from 'react';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginError: string | null;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface User {
  name: string;
  email: string;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loginError: null,
  setLoginError: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, loginError, setLoginError }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

interface User {
  name: string;
  email: string;
}

export default User;

import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

interface Props {}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginError: string | null;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface User {
  name: string;
  email: string;
}

const ReferralComponent: React.FC<Props> = () => {
  const { user, setUser, loginError, setLoginError } = useContext(UserContext);

  const handleLogin = () => {
    // Simulate user login logic here
    // Set user state and clear error
    fetch('https://api.example.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'john.doe@example.com', password: 'password' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        setUser({ name: data.name, email: data.email });
        setLoginError(null);
      })
      .catch((error) => {
        setLoginError(error.message);
      });
  };

  if (!user) {
    return (
      <>
        <h1>Please log in to access the referral system.</h1>
        <button onClick={handleLogin}>Login</button>
        {loginError && <p>{loginError}</p>}
      </>
    );
  }

  return <h1>Hello, {user.name}! Welcome to Climate Pulse's Referral System.</h1>;
};

export default ReferralComponent;

import React, { createContext, useState } from 'react';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginError: string | null;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface User {
  name: string;
  email: string;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loginError: null,
  setLoginError: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, loginError, setLoginError }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

interface User {
  name: string;
  email: string;
}

export default User;

**UserContext.tsx**

**User.ts**