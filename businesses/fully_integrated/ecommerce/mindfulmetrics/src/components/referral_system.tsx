import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  referralCount,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to copy the referral link. Please try again.');
    }
  }, [referralLink]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral link"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copySuccess ? 'Copied!' : 'Copy link'}
          disabled={error !== null}
        >
          {copySuccess ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  referralCount,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to copy the referral link. Please try again.');
    }
  }, [referralLink]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral link"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copySuccess ? 'Copied!' : 'Copy link'}
          disabled={error !== null}
        >
          {copySuccess ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;