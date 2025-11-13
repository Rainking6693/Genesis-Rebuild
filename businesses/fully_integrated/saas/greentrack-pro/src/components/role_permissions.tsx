import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@chakra-ui/react'; // You might need to install this package for the Spinner component

// Add a custom hook for role permission check
const useHasPermission = (permission: string) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const response = await fetch('/api/user/permissions', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }

      const data = await response.json();
      setHasPermission(data.includes(permission));
    } catch (error) {
      console.error(error);
      setHasPermission(false);
    }
  }, [permission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return hasPermission;
};

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const hasPermission = useHasPermission('view_sustainability_data');
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: Error) => {
    console.error(error);
  };

  const handleCalculationComplete = () => {
    setIsLoading(false);
  };

  // Perform necessary calculations and optimizations
  // Generate compliance reports and cost-saving recommendations

  if (!hasPermission) {
    return <div>You do not have permission to view this data.</div>;
  }

  if (hasPermission === null) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div role="alert" aria-live="polite">
        {message}
      </div>
      {/* Add a loading state if calculations or optimizations take time */}
      {isLoading && (
        <div>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from '@chakra-ui/react'; // You might need to install this package for the Spinner component

// Add a custom hook for role permission check
const useHasPermission = (permission: string) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const response = await fetch('/api/user/permissions', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }

      const data = await response.json();
      setHasPermission(data.includes(permission));
    } catch (error) {
      console.error(error);
      setHasPermission(false);
    }
  }, [permission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return hasPermission;
};

interface Props {
  message: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const hasPermission = useHasPermission('view_sustainability_data');
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: Error) => {
    console.error(error);
  };

  const handleCalculationComplete = () => {
    setIsLoading(false);
  };

  // Perform necessary calculations and optimizations
  // Generate compliance reports and cost-saving recommendations

  if (!hasPermission) {
    return <div>You do not have permission to view this data.</div>;
  }

  if (hasPermission === null) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div role="alert" aria-live="polite">
        {message}
      </div>
      {/* Add a loading state if calculations or optimizations take time */}
      {isLoading && (
        <div>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      )}
    </div>
  );
};

export default MyComponent;