import React, { useEffect, useState } from 'react';
import { RoleBasedAccessControl } from '@genesis/rbac';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setUserRole(await RoleBasedAccessControl.getUserRole());
      } catch (error) {
        setError(error);
      }
    };

    checkUserRole();
  }, []);

  if (!userRole) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (userRole !== 'admin' && userRole !== 'sustainability_expert') {
    return <div>Unauthorized access</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { RoleBasedAccessControl } from '@genesis/rbac';

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setUserRole(await RoleBasedAccessControl.getUserRole());
      } catch (error) {
        setError(error);
      }
    };

    checkUserRole();
  }, []);

  if (!userRole) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (userRole !== 'admin' && userRole !== 'sustainability_expert') {
    return <div>Unauthorized access</div>;
  }

  return <div>{message}</div>;
};

export default MyComponent;