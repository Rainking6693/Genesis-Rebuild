import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  userId: string;
  userRole: string | null;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, userId, userRole }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const checkUserPermissions = useCallback(() => {
    if (userRole === null) {
      setIsAuthorized(false);
      return;
    }

    const isAdmin = userRole === 'admin';
    const isManager = userRole === 'manager';
    setIsAuthorized(isAdmin || isManager);
  }, [userRole]);

  useEffect(() => {
    checkUserPermissions();
  }, [checkUserPermissions]);

  return (
    <div>
      {isAuthorized === null ? (
        <p aria-live="polite">Loading...</p>
      ) : isAuthorized ? (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
        </>
      ) : (
        <p aria-live="polite">You do not have permission to view this content.</p>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
  userId: string;
  userRole: string | null;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, userId, userRole }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const checkUserPermissions = useCallback(() => {
    if (userRole === null) {
      setIsAuthorized(false);
      return;
    }

    const isAdmin = userRole === 'admin';
    const isManager = userRole === 'manager';
    setIsAuthorized(isAdmin || isManager);
  }, [userRole]);

  useEffect(() => {
    checkUserPermissions();
  }, [checkUserPermissions]);

  return (
    <div>
      {isAuthorized === null ? (
        <p aria-live="polite">Loading...</p>
      ) : isAuthorized ? (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
        </>
      ) : (
        <p aria-live="polite">You do not have permission to view this content.</p>
      )}
    </div>
  );
};

export default MyComponent;