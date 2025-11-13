import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode?: string; // Make referralCode optional
  onReferralSubmit: (code: string) => Promise<void>; // Ensure onReferralSubmit is async
  submitButtonText?: string; // Customizable submit button text
  submittingButtonText?: string; // Customizable submitting button text
  inputPlaceholder?: string; // Customizable input placeholder
  errorMessage?: string; // Customizable generic error message
  emptyCodeErrorMessage?: string; // Customizable empty code error message
  successMessage?: string; // Optional success message
  onSuccess?: () => void; // Optional callback on success
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode = '', // Provide a default value
  onReferralSubmit,
  submitButtonText = 'Submit',
  submittingButtonText = 'Submitting...',
  inputPlaceholder = 'Enter referral code',
  errorMessage = 'An error occurred while submitting the referral code.',
  emptyCodeErrorMessage = 'Please enter a referral code.',
  successMessage,
  onSuccess,
}) => {
  const [referralInput, setReferralInput] = useState<string>(referralCode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReferralInput(referralCode);
  }, [referralCode]);

  const handleReferralSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      const trimmedInput = referralInput.trim();

      if (!trimmedInput) {
        setError(emptyCodeErrorMessage);
        return;
      }

      await onReferralSubmit(trimmedInput);

      setReferralInput('');
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }

      // Focus back to the input for better UX
      if (inputRef.current) {
        inputRef.current.focus();
      }

    } catch (err) {
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    referralInput,
    onReferralSubmit,
    emptyCodeErrorMessage,
    errorMessage,
    onSuccess,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralInput(e.target.value);
    setError(null); // Clear error on input change
    setSuccess(false); // Clear success on input change
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleReferralSubmit();
    }
  };

  return (
    <div role="form" aria-label="Referral Form">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <label htmlFor="referral-code-input">{inputPlaceholder}</label>
        <input
          ref={inputRef}
          type="text"
          id="referral-code-input"
          value={referralInput}
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          aria-label="Referral code input"
          aria-invalid={error !== null}
          aria-describedby={error ? 'referral-error' : undefined}
          disabled={isSubmitting}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleReferralSubmit}
          disabled={isSubmitting}
          aria-label="Submit referral code"
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </div>
      {error && (
        <div id="referral-error" role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      {success && successMessage && (
        <div role="alert" style={{ color: 'green' }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode?: string; // Make referralCode optional
  onReferralSubmit: (code: string) => Promise<void>; // Ensure onReferralSubmit is async
  submitButtonText?: string; // Customizable submit button text
  submittingButtonText?: string; // Customizable submitting button text
  inputPlaceholder?: string; // Customizable input placeholder
  errorMessage?: string; // Customizable generic error message
  emptyCodeErrorMessage?: string; // Customizable empty code error message
  successMessage?: string; // Optional success message
  onSuccess?: () => void; // Optional callback on success
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode = '', // Provide a default value
  onReferralSubmit,
  submitButtonText = 'Submit',
  submittingButtonText = 'Submitting...',
  inputPlaceholder = 'Enter referral code',
  errorMessage = 'An error occurred while submitting the referral code.',
  emptyCodeErrorMessage = 'Please enter a referral code.',
  successMessage,
  onSuccess,
}) => {
  const [referralInput, setReferralInput] = useState<string>(referralCode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setReferralInput(referralCode);
  }, [referralCode]);

  const handleReferralSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      const trimmedInput = referralInput.trim();

      if (!trimmedInput) {
        setError(emptyCodeErrorMessage);
        return;
      }

      await onReferralSubmit(trimmedInput);

      setReferralInput('');
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }

      // Focus back to the input for better UX
      if (inputRef.current) {
        inputRef.current.focus();
      }

    } catch (err) {
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    referralInput,
    onReferralSubmit,
    emptyCodeErrorMessage,
    errorMessage,
    onSuccess,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralInput(e.target.value);
    setError(null); // Clear error on input change
    setSuccess(false); // Clear success on input change
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleReferralSubmit();
    }
  };

  return (
    <div role="form" aria-label="Referral Form">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <label htmlFor="referral-code-input">{inputPlaceholder}</label>
        <input
          ref={inputRef}
          type="text"
          id="referral-code-input"
          value={referralInput}
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          aria-label="Referral code input"
          aria-invalid={error !== null}
          aria-describedby={error ? 'referral-error' : undefined}
          disabled={isSubmitting}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleReferralSubmit}
          disabled={isSubmitting}
          aria-label="Submit referral code"
        >
          {isSubmitting ? submittingButtonText : submitButtonText}
        </button>
      </div>
      {error && (
        <div id="referral-error" role="alert" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      {success && successMessage && (
        <div role="alert" style={{ color: 'green' }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ReferralComponent;