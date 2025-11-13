import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  onReferral: (email: string) => Promise<void>;
  emailValidationRegex?: RegExp;
  successMessage?: string;
  errorMessage?: string;
  referralButtonText?: string;
  emailInputPlaceholder?: string;
  ariaLabelEmailInput?: string;
}

const defaultEmailValidationRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  onReferral,
  emailValidationRegex = defaultEmailValidationRegex,
  successMessage = 'Referral sent successfully!',
  errorMessage = 'Please enter a valid email address.',
  referralButtonText = 'Refer a Friend',
  emailInputPlaceholder = 'Enter email address',
  ariaLabelEmailInput = 'Email address for referral',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the email input when the component mounts
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleReferral = useCallback(async () => {
    if (isSubmitting) return;

    if (!emailValidationRegex.test(email)) {
      setValidationError(errorMessage);
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      await onReferral(email);
      setEmail('');
      alert(successMessage);
    } catch (error: any) {
      console.error('Referral failed:', error);
      alert(`Referral failed: ${error?.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, onReferral, isSubmitting, errorMessage, successMessage, emailValidationRegex]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleReferral();
      }
    },
    [handleReferral]
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <label htmlFor="referral-email-input">{emailInputPlaceholder}</label>
      <input
        type="email"
        id="referral-email-input"
        placeholder={emailInputPlaceholder}
        value={email}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabelEmailInput}
        disabled={isSubmitting}
        ref={emailInputRef}
        required
      />
      {validationError && <div style={{ color: 'red' }}>{validationError}</div>}
      <button onClick={handleReferral} disabled={isSubmitting}>
        {isSubmitting ? 'Referring...' : referralButtonText}
      </button>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  onReferral: (email: string) => Promise<void>;
  emailValidationRegex?: RegExp;
  successMessage?: string;
  errorMessage?: string;
  referralButtonText?: string;
  emailInputPlaceholder?: string;
  ariaLabelEmailInput?: string;
}

const defaultEmailValidationRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  onReferral,
  emailValidationRegex = defaultEmailValidationRegex,
  successMessage = 'Referral sent successfully!',
  errorMessage = 'Please enter a valid email address.',
  referralButtonText = 'Refer a Friend',
  emailInputPlaceholder = 'Enter email address',
  ariaLabelEmailInput = 'Email address for referral',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the email input when the component mounts
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleReferral = useCallback(async () => {
    if (isSubmitting) return;

    if (!emailValidationRegex.test(email)) {
      setValidationError(errorMessage);
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      await onReferral(email);
      setEmail('');
      alert(successMessage);
    } catch (error: any) {
      console.error('Referral failed:', error);
      alert(`Referral failed: ${error?.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, onReferral, isSubmitting, errorMessage, successMessage, emailValidationRegex]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleReferral();
      }
    },
    [handleReferral]
  );

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <label htmlFor="referral-email-input">{emailInputPlaceholder}</label>
      <input
        type="email"
        id="referral-email-input"
        placeholder={emailInputPlaceholder}
        value={email}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabelEmailInput}
        disabled={isSubmitting}
        ref={emailInputRef}
        required
      />
      {validationError && <div style={{ color: 'red' }}>{validationError}</div>}
      <button onClick={handleReferral} disabled={isSubmitting}>
        {isSubmitting ? 'Referring...' : referralButtonText}
      </button>
    </div>
  );
};

export default ReferralComponent;