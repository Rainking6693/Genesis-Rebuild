import React, { createContext, useState, useContext, ReactNode } from 'react';

// Add type for UserContextData and User interface
interface UserContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// UserContext creation
const UserContext = createContext<UserContextData>({} as UserContextData);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Implement user authentication and setUser logic here
  // For demonstration purposes, I've added a sample user object
  const sampleUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const setSampleUser = () => {
    setUser(sampleUser);
  };

  // Check if setUser is a function before updating the user state
  if (typeof setUser === 'function') {
    setUser(sampleUser);
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export type Props = {};

const MyComponent: React.FC<Props> = () => {
  const { user, setUser } = useContext(UserContext);

  // Add a check for user existence before rendering the component
  if (!user) {
    return <h1>Please log in to continue.</h1>;
  }

  // Add accessibility improvements by wrapping the greeting in a link
  // This allows screen reader users to navigate to the user's profile
  return (
    <a href={`/profile/${user.id}`}>
      <h1>Hello, {user.name}!</h1>
    </a>
  );
};

export default MyComponent;

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Add type for UserContextData and User interface
interface UserContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// UserContext creation
const UserContext = createContext<UserContextData>({} as UserContextData);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Implement user authentication and setUser logic here
  // For demonstration purposes, I've added a sample user object
  const sampleUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const setSampleUser = () => {
    setUser(sampleUser);
  };

  // Check if setUser is a function before updating the user state
  if (typeof setUser === 'function') {
    setUser(sampleUser);
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export type Props = {};

const MyComponent: React.FC<Props> = () => {
  const { user, setUser } = useContext(UserContext);

  // Add a check for user existence before rendering the component
  if (!user) {
    return <h1>Please log in to continue.</h1>;
  }

  // Add accessibility improvements by wrapping the greeting in a link
  // This allows screen reader users to navigate to the user's profile
  return (
    <a href={`/profile/${user.id}`}>
      <h1>Hello, {user.name}!</h1>
    </a>
  );
};

export default MyComponent;