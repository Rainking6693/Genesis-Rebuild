import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

interface RolePermissionsProps {
  title: string;
  content: string;
  userId: string;
  userRole: string | null | undefined;
  allowedRoles?: string[];
  fallbackComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

const RolePermissions: React.FC<RolePermissionsProps> = memo(
  ({
    title,
    content,
    userId,
    userRole,
    allowedRoles = ['admin', 'editor'], // Default roles
    fallbackComponent = <p aria-live="polite">You are not authorized to view this content.</p>,
    errorComponent = <p>An error occurred while checking permissions.</p>,
    isLoading = false,
    loadingComponent = <p>Loading content...</p>,
  }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [hasError, setHasError] = useState(false);

    const checkAuthorization = useCallback(() => {
      if (isLoading) {
        return; // Avoid checking authorization while loading
      }

      try {
        if (!userRole) {
          setIsAuthorized(false); // Handle null or undefined userRole explicitly
          return;
        }

        if (!allowedRoles || allowedRoles.length === 0) {
          setIsAuthorized(true); // If no roles are specified, allow all
          return;
        }

        const isAllowed = allowedRoles.includes(userRole);
        setIsAuthorized(isAllowed);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        setHasError(true);
      }
    }, [userRole, allowedRoles, isLoading]);

    useEffect(() => {
      checkAuthorization();
    }, [checkAuthorization]);

    if (isLoading) {
      return loadingComponent;
    }

    if (hasError) {
      return errorComponent;
    }

    if (isAuthorized === null) {
      return null; // Or a default loading state if desired
    }

    return (
      <div>
        {isAuthorized ? (
          <>
            <h1>{title}</h1>
            <p>{content}</p>
          </>
        ) : (
          fallbackComponent
        )}
      </div>
    );
  },
);

RolePermissions.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userRole: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  fallbackComponent: PropTypes.node,
  errorComponent: PropTypes.node,
  isLoading: PropTypes.bool,
  loadingComponent: PropTypes.node,
};

export default RolePermissions;

import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

interface RolePermissionsProps {
  title: string;
  content: string;
  userId: string;
  userRole: string | null | undefined;
  allowedRoles?: string[];
  fallbackComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

const RolePermissions: React.FC<RolePermissionsProps> = memo(
  ({
    title,
    content,
    userId,
    userRole,
    allowedRoles = ['admin', 'editor'], // Default roles
    fallbackComponent = <p aria-live="polite">You are not authorized to view this content.</p>,
    errorComponent = <p>An error occurred while checking permissions.</p>,
    isLoading = false,
    loadingComponent = <p>Loading content...</p>,
  }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [hasError, setHasError] = useState(false);

    const checkAuthorization = useCallback(() => {
      if (isLoading) {
        return; // Avoid checking authorization while loading
      }

      try {
        if (!userRole) {
          setIsAuthorized(false); // Handle null or undefined userRole explicitly
          return;
        }

        if (!allowedRoles || allowedRoles.length === 0) {
          setIsAuthorized(true); // If no roles are specified, allow all
          return;
        }

        const isAllowed = allowedRoles.includes(userRole);
        setIsAuthorized(isAllowed);
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
        setHasError(true);
      }
    }, [userRole, allowedRoles, isLoading]);

    useEffect(() => {
      checkAuthorization();
    }, [checkAuthorization]);

    if (isLoading) {
      return loadingComponent;
    }

    if (hasError) {
      return errorComponent;
    }

    if (isAuthorized === null) {
      return null; // Or a default loading state if desired
    }

    return (
      <div>
        {isAuthorized ? (
          <>
            <h1>{title}</h1>
            <p>{content}</p>
          </>
        ) : (
          fallbackComponent
        )}
      </div>
    );
  },
);

RolePermissions.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userRole: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  fallbackComponent: PropTypes.node,
  errorComponent: PropTypes.node,
  isLoading: PropTypes.bool,
  loadingComponent: PropTypes.node,
};

export default RolePermissions;