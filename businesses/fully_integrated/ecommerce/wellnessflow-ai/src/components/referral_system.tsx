import React, { useState, useEffect, useCallback } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode: string;
  onReferralSubmit: (code: string) => Promise<void>;
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode,
  onReferralSubmit,
}) => {
  const [inputCode, setInputCode] = useState<string>(referralCode || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prefill the referral code input with the user's unique code
    setInputCode(referralCode || '');
  }, [referralCode]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        await onReferralSubmit(inputCode.trim());
      } catch (err) {
        setError('An error occurred while submitting the referral code.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [inputCode, onReferralSubmit]
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="referral-code">Enter your referral code:</label>
        <input
          type="text"
          id="referral-code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          required
          pattern="[a-zA-Z0-9]{8}"
          title="Referral code must be 8 characters long and contain only letters and numbers"
          aria-describedby="referral-code-error"
        />
        {error && (
          <div id="referral-code-error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode: string;
  onReferralSubmit: (code: string) => Promise<void>;
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode,
  onReferralSubmit,
}) => {
  const [inputCode, setInputCode] = useState<string>(referralCode || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prefill the referral code input with the user's unique code
    setInputCode(referralCode || '');
  }, [referralCode]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        await onReferralSubmit(inputCode.trim());
      } catch (err) {
        setError('An error occurred while submitting the referral code.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [inputCode, onReferralSubmit]
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="referral-code">Enter your referral code:</label>
        <input
          type="text"
          id="referral-code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          required
          pattern="[a-zA-Z0-9]{8}"
          title="Referral code must be 8 characters long and contain only letters and numbers"
          aria-describedby="referral-code-error"
        />
        {error && (
          <div id="referral-code-error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ReferralComponent;