import React, { FC, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useEcoScore, useAuth, useMediaQuery, useTitle, useLocale } from '@ecoscore-analytics/api-client';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [ecoScore, setEcoScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const title = useTitle();
  const locale = useLocale();
  const fetchEcoScore = useCallback(async () => {
    try {
      const data = await useEcoScore();
      if (Array.isArray(data) && data.length > 0) {
        setEcoScore(data[0]);
        setLoading(false);
      } else {
        setError(new Error('Invalid eco-score data'));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && !cancelRef.current) {
      cancelRef.current = fetchEcoScore();
    }

    // Clean up on component unmount
    return () => {
      if (cancelRef.current) {
        clearTimeout(cancelRef.current);
      }
    };
  }, [user, fetchEcoScore]);

  const displayEcoScore = useMemo(() => {
    if (ecoScore === null) {
      return '';
    }
    if (ecoScore < minimalEcoScore) {
      return `Your Eco-Score: ${ecoScore} (Below Minimal)`;
    }
    return `Your Eco-Score: ${ecoScore}`;
  }, [ecoScore]);

  title.set(`${locale.t('MyComponent')} - Your Eco-Score`);

  if (!user) {
    return <div>Please log in to access this feature.</div>;
  }

  return (
    <div data-testid="my-component" key={title} className={isMobile ? 'mobile' : ''}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {displayEcoScore && <div>{displayEcoScore}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const minimalEcoScore = 50; // Adjust this value as needed

export default MyComponent;

import React, { FC, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useEcoScore, useAuth, useMediaQuery, useTitle, useLocale } from '@ecoscore-analytics/api-client';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [ecoScore, setEcoScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const title = useTitle();
  const locale = useLocale();
  const fetchEcoScore = useCallback(async () => {
    try {
      const data = await useEcoScore();
      if (Array.isArray(data) && data.length > 0) {
        setEcoScore(data[0]);
        setLoading(false);
      } else {
        setError(new Error('Invalid eco-score data'));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && !cancelRef.current) {
      cancelRef.current = fetchEcoScore();
    }

    // Clean up on component unmount
    return () => {
      if (cancelRef.current) {
        clearTimeout(cancelRef.current);
      }
    };
  }, [user, fetchEcoScore]);

  const displayEcoScore = useMemo(() => {
    if (ecoScore === null) {
      return '';
    }
    if (ecoScore < minimalEcoScore) {
      return `Your Eco-Score: ${ecoScore} (Below Minimal)`;
    }
    return `Your Eco-Score: ${ecoScore}`;
  }, [ecoScore]);

  title.set(`${locale.t('MyComponent')} - Your Eco-Score`);

  if (!user) {
    return <div>Please log in to access this feature.</div>;
  }

  return (
    <div data-testid="my-component" key={title} className={isMobile ? 'mobile' : ''}>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {displayEcoScore && <div>{displayEcoScore}</div>}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

const minimalEcoScore = 50; // Adjust this value as needed

export default MyComponent;