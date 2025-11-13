import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode: string;
  onReferralCodeCopied: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedConfirmationDuration?: number; // Duration for "Copied!" message (ms)
  inputFieldAriaLabel?: string; // Aria label for the input field
  copyButtonAriaLabel?: string; // Aria label for the copy button
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode,
  onReferralCodeCopied,
  copyButtonLabel = 'Copy',
  copiedConfirmationDuration = 3000,
  inputFieldAriaLabel = 'Referral Code',
  copyButtonAriaLabel = 'Copy referral code to clipboard',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState(copyButtonLabel);
  const [isError, setIsError] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback to memoize the handler
  const handleCopyReferralCode = useCallback(() => {
    // Use try-catch for clipboard API errors (e.g., browser permissions)
    try {
      navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      setIsError(false);
      setCopyButtonText('Copied!'); // Update button text immediately
      onReferralCodeCopied();
    } catch (err) {
      console.error('Failed to copy referral code: ', err);
      // Handle the error gracefully, e.g., show an error message to the user
      setIsError(true);
      setCopyButtonText('Error'); // Indicate error on the button
      setIsCopied(false); // Reset copied state
    }
  }, [referralCode, onReferralCodeCopied]);

  useEffect(() => {
    if (isCopied) {
      // Clear any existing timer to prevent multiple timeouts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        setCopyButtonText(copyButtonLabel); // Reset button text after timeout
        timerRef.current = null;
      }, copiedConfirmationDuration);
    }

    // Cleanup function to clear the timeout when the component unmounts or isCopied changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isCopied, copyButtonLabel, copiedConfirmationDuration]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <label htmlFor="referral-code">Referral Code:</label>
        <input
          type="text"
          id="referral-code"
          value={referralCode}
          readOnly
          aria-label={inputFieldAriaLabel}
          aria-roledescription="referral code"
        />
        <button
          onClick={handleCopyReferralCode}
          aria-label={copyButtonAriaLabel}
          disabled={isError} // Disable button if there was an error
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralCode: string;
  onReferralCodeCopied: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedConfirmationDuration?: number; // Duration for "Copied!" message (ms)
  inputFieldAriaLabel?: string; // Aria label for the input field
  copyButtonAriaLabel?: string; // Aria label for the copy button
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralCode,
  onReferralCodeCopied,
  copyButtonLabel = 'Copy',
  copiedConfirmationDuration = 3000,
  inputFieldAriaLabel = 'Referral Code',
  copyButtonAriaLabel = 'Copy referral code to clipboard',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState(copyButtonLabel);
  const [isError, setIsError] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback to memoize the handler
  const handleCopyReferralCode = useCallback(() => {
    // Use try-catch for clipboard API errors (e.g., browser permissions)
    try {
      navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      setIsError(false);
      setCopyButtonText('Copied!'); // Update button text immediately
      onReferralCodeCopied();
    } catch (err) {
      console.error('Failed to copy referral code: ', err);
      // Handle the error gracefully, e.g., show an error message to the user
      setIsError(true);
      setCopyButtonText('Error'); // Indicate error on the button
      setIsCopied(false); // Reset copied state
    }
  }, [referralCode, onReferralCodeCopied]);

  useEffect(() => {
    if (isCopied) {
      // Clear any existing timer to prevent multiple timeouts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        setCopyButtonText(copyButtonLabel); // Reset button text after timeout
        timerRef.current = null;
      }, copiedConfirmationDuration);
    }

    // Cleanup function to clear the timeout when the component unmounts or isCopied changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isCopied, copyButtonLabel, copiedConfirmationDuration]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <label htmlFor="referral-code">Referral Code:</label>
        <input
          type="text"
          id="referral-code"
          value={referralCode}
          readOnly
          aria-label={inputFieldAriaLabel}
          aria-roledescription="referral code"
        />
        <button
          onClick={handleCopyReferralCode}
          aria-label={copyButtonAriaLabel}
          disabled={isError} // Disable button if there was an error
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
};

export default ReferralComponent;