import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '../../../common/hooks/useA_BTesting';

interface Props {
  message: string;
  id: string;
  defaultVariant?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, id, defaultVariant = 'control', ariaLabel }) => {
  const [testVariant, setTestVariant] = useState(defaultVariant);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestVariant = async () => {
      try {
        setIsLoading(true);
        const result = await useA/BTesting(id);
        setTestVariant(result);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (testVariant === defaultVariant) {
      fetchTestVariant();
    }
  }, [id, defaultVariant]);

  return (
    <div>
      {isLoading ? (
        <div role="alert" aria-live="polite">
          Loading test variant...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          Error fetching test variant for {id}: {error.message}
        </div>
      ) : (
        <div role="alert" aria-label={ariaLabel}>
          {testVariant === 'control' ? (
            <>
              {message}
              <div>Control</div>
            </>
          ) : (
            <>
              Test Variant: {testVariant}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import { useA/BTesting } from '../../../common/hooks/useA_BTesting';

interface Props {
  message: string;
  id: string;
  defaultVariant?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, id, defaultVariant = 'control', ariaLabel }) => {
  const [testVariant, setTestVariant] = useState(defaultVariant);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestVariant = async () => {
      try {
        setIsLoading(true);
        const result = await useA/BTesting(id);
        setTestVariant(result);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (testVariant === defaultVariant) {
      fetchTestVariant();
    }
  }, [id, defaultVariant]);

  return (
    <div>
      {isLoading ? (
        <div role="alert" aria-live="polite">
          Loading test variant...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          Error fetching test variant for {id}: {error.message}
        </div>
      ) : (
        <div role="alert" aria-label={ariaLabel}>
          {testVariant === 'control' ? (
            <>
              {message}
              <div>Control</div>
            </>
          ) : (
            <>
              Test Variant: {testVariant}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyComponent;