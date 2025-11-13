// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  id?: string;
}

interface UserContextData {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextData>({
  user: {} as User | null,
  signIn: () => {},
  signOut: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    // Authenticate user and set user state
    setUser(user);
  };

  const signOut = () => {
    // Clear user state
    setUser(null);
  };

  useEffect(() => {
    // Clean up the user state when the component unmounts
    return () => {
      setUser(null);
    };
  }, []);

  const userWithId = useMemo(() => ({ ...user, id: user?.id || '' }), [user]);

  return (
    <UserContext.Provider value={{ user: userWithId, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// ReferralComponent.tsx
import React from 'react';
import { UserContext } from './UserContext';

interface Props {}

const ReferralComponent: React.FC<Props> = () => {
  const { user } = useContext(UserContext);

  if (!user || !user.name.trim()) {
    return <h1>Please log in to access the referral system.</h1>;
  }

  return (
    <h1>
      Hello, {user.name}! Welcome to our referral system.
      {user.id && <span> (Your ID: {user.id})</span>}
    </h1>
  );
};

export default ReferralComponent;

// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  id?: string;
}

interface UserContextData {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextData>({
  user: {} as User | null,
  signIn: () => {},
  signOut: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    // Authenticate user and set user state
    setUser(user);
  };

  const signOut = () => {
    // Clear user state
    setUser(null);
  };

  useEffect(() => {
    // Clean up the user state when the component unmounts
    return () => {
      setUser(null);
    };
  }, []);

  const userWithId = useMemo(() => ({ ...user, id: user?.id || '' }), [user]);

  return (
    <UserContext.Provider value={{ user: userWithId, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// ReferralComponent.tsx
import React from 'react';
import { UserContext } from './UserContext';

interface Props {}

const ReferralComponent: React.FC<Props> = () => {
  const { user } = useContext(UserContext);

  if (!user || !user.name.trim()) {
    return <h1>Please log in to access the referral system.</h1>;
  }

  return (
    <h1>
      Hello, {user.name}! Welcome to our referral system.
      {user.id && <span> (Your ID: {user.id})</span>}
    </h1>
  );
};

export default ReferralComponent;