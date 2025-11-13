import React, { useEffect, useState } from 'react';
import { useAuth, AuthUser, AuthRole } from '../../../security/auth';

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const subscription = useAuth((state) => state.user);
    subscription.subscribe((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Redirect to access denied page or show a modal
      // Handle this in a more robust way based on your application's needs
      setError(new Error('Access Denied'));
    }
  }, [user]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return (
      <div>
        <h1>An error occurred while loading the user data.</h1>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  return <h1>Hello, {name}!</h1>;
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useAuth, AuthUser, AuthRole } from '../../../security/auth';

interface Props {
  name: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const subscription = useAuth((state) => state.user);
    subscription.subscribe((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      // Redirect to access denied page or show a modal
      // Handle this in a more robust way based on your application's needs
      setError(new Error('Access Denied'));
    }
  }, [user]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return (
      <div>
        <h1>An error occurred while loading the user data.</h1>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  return <h1>Hello, {name}!</h1>;
};

export default MyComponent;