import React, { ReactNode, useEffect, Suspense } from 'react';
import { RoleBasedAccessControl, CheckPermissionResult } from '@genesis/security-agent';

type Props = {
  message: string;
  requiredRole: string;
  fallbackMessage?: string;
};

type FallbackProps = {
  error: Error;
};

const MyComponent: React.FC<Props> = ({ message, requiredRole, fallbackMessage = "You do not have the required permissions to view this content." }) => {
  const [hasRequiredRole, setHasRequiredRole] = React.useState<boolean>(false);

  useEffect(() => {
    const checkPermission = async () => {
      const result: CheckPermissionResult = await RoleBasedAccessControl.checkPermission(requiredRole);
      setHasRequiredRole(result.granted);
    };

    checkPermission();
  }, [requiredRole]);

  if (hasRequiredRole) {
    return <div>{message}</div>;
  }

  return (
    <Suspense fallback={<div>{fallbackMessage}</div>}>
      <FallbackComponent fallbackMessage={fallbackMessage} />
    </Suspense>
  );
};

const FallbackComponent: React.FC<FallbackProps> = ({ fallbackMessage }) => {
  return <div>{fallbackMessage}</div>;
};

export default MyComponent;

import React, { ReactNode, useEffect, Suspense } from 'react';
import { RoleBasedAccessControl, CheckPermissionResult } from '@genesis/security-agent';

type Props = {
  message: string;
  requiredRole: string;
  fallbackMessage?: string;
};

type FallbackProps = {
  error: Error;
};

const MyComponent: React.FC<Props> = ({ message, requiredRole, fallbackMessage = "You do not have the required permissions to view this content." }) => {
  const [hasRequiredRole, setHasRequiredRole] = React.useState<boolean>(false);

  useEffect(() => {
    const checkPermission = async () => {
      const result: CheckPermissionResult = await RoleBasedAccessControl.checkPermission(requiredRole);
      setHasRequiredRole(result.granted);
    };

    checkPermission();
  }, [requiredRole]);

  if (hasRequiredRole) {
    return <div>{message}</div>;
  }

  return (
    <Suspense fallback={<div>{fallbackMessage}</div>}>
      <FallbackComponent fallbackMessage={fallbackMessage} />
    </Suspense>
  );
};

const FallbackComponent: React.FC<FallbackProps> = ({ fallbackMessage }) => {
  return <div>{fallbackMessage}</div>;
};

export default MyComponent;