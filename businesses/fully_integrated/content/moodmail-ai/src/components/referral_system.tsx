import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  onReferralComplete: () => void;
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  onReferralComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const handleReferral = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      setError(null);
      await axios.post<{ message?: string }>('/api/referrals', { referralLink });
      onReferralComplete();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          'An error occurred while processing the referral. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [referralLink, onReferralComplete]);

  useEffect(() => {
    isMounted.current = true;
    handleReferral();

    return () => {
      isMounted.current = false;
    };
  }, [handleReferral]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      ) : (
        <a
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Refer a friend"
        >
          Refer a friend
        </a>
      )}
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  onReferralComplete: () => void;
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  onReferralComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const handleReferral = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      setError(null);
      await axios.post<{ message?: string }>('/api/referrals', { referralLink });
      onReferralComplete();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          'An error occurred while processing the referral. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [referralLink, onReferralComplete]);

  useEffect(() => {
    isMounted.current = true;
    handleReferral();

    return () => {
      isMounted.current = false;
    };
  }, [handleReferral]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      ) : (
        <a
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Refer a friend"
        >
          Refer a friend
        </a>
      )}
    </div>
  );
};

export default ReferralComponent;