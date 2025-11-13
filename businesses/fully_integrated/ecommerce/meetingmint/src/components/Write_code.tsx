import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

interface Props {
  greetingMessage?: string;
}

interface User {
  name: string;
  // Add other user properties as needed
}

const MyComponent: React.FC<Props> = ({ greetingMessage = 'Welcome' }) => {
  const { user, isLoading, error } = useContext(AppContext);
  const [greeting, setGreeting] = useState(greetingMessage);

  // Check if user.name is defined before concatenating
  useEffect(() => {
    if (user && user.name) {
      setGreeting(`${greeting}, ${user.name}!`);
    }
  }, [user]);

  // Handle null user and empty greeting message
  if (!user) {
    return <p>Please log in to continue.</p>;
  }

  if (!greeting) {
    return <p>An error occurred while setting the greeting message.</p>;
  }

  // Add ARIA attributes for accessibility
  return <h1 aria-label={`Greeting for ${user.name}`}>{greeting}</h1>;

  // Add error boundary to handle any unexpected errors
  // This is a separate component that wraps MyComponent
  // and catches and handles errors
};

export default MyComponent;

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

interface Props {
  greetingMessage?: string;
}

interface User {
  name: string;
  // Add other user properties as needed
}

const MyComponent: React.FC<Props> = ({ greetingMessage = 'Welcome' }) => {
  const { user, isLoading, error } = useContext(AppContext);
  const [greeting, setGreeting] = useState(greetingMessage);

  // Check if user.name is defined before concatenating
  useEffect(() => {
    if (user && user.name) {
      setGreeting(`${greeting}, ${user.name}!`);
    }
  }, [user]);

  // Handle null user and empty greeting message
  if (!user) {
    return <p>Please log in to continue.</p>;
  }

  if (!greeting) {
    return <p>An error occurred while setting the greeting message.</p>;
  }

  // Add ARIA attributes for accessibility
  return <h1 aria-label={`Greeting for ${user.name}`}>{greeting}</h1>;

  // Add error boundary to handle any unexpected errors
  // This is a separate component that wraps MyComponent
  // and catches and handles errors
};

export default MyComponent;