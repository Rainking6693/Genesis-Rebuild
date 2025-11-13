import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  onReferral: (referralLink: string) => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedMessage?: string; // Customizable copied message
  inputAriaLabel?: string; // Aria label for the input field
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  onReferral,
  copyButtonLabel = 'Copy Referral Link',
  copiedMessage = 'Copied!',
  inputAriaLabel = 'Referral Link',
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const inputRef = useRef<HTMLInputElement>(null);

  // Using useCallback to memoize the handleCopy function
  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setCopied(true);
          onReferral(referralLink);
          setCopyError(null); // Clear any previous errors
        })
        .catch((err) => {
          console.error('Failed to copy referral link: ', err);
          setCopied(false);
          setCopyError(err);
          // Fallback to manual selection and copy if clipboard API fails
          if (inputRef.current) {
            inputRef.current.select();
            document.execCommand('copy'); // Deprecated, but useful as a fallback
            setCopied(true); // Indicate copy success even with fallback
            onReferral(referralLink);
          }
        });
    } else {
      // Fallback to manual selection and copy if clipboard API is not available
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy'); // Deprecated, but useful as a fallback
        setCopied(true); // Indicate copy success even with fallback
        onReferral(referralLink);
      } else {
        setCopyError(new Error('Unable to copy referral link'));
      }
    }
  }, [referralLink, onReferral]);

  // Using useEffect for the copied state timeout
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout on unmount or copied change
    }
  }, [copied]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputAriaLabel}
          ref={inputRef}
          onClick={(e) => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
        />
        <button
          onClick={handleCopy}
          disabled={copyError !== null}
          aria-label={copied ? copiedMessage : copyButtonLabel}
        >
          {copied ? copiedMessage : copyButtonLabel}
        </button>
        {copyError && (
          <p role="alert" style={{ color: 'red' }}>
            {copyError.message || 'Failed to copy. Please select and copy manually.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralProps {
  title: string;
  content: string;
  referralLink: string;
  onReferral: (referralLink: string) => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedMessage?: string; // Customizable copied message
  inputAriaLabel?: string; // Aria label for the input field
}

const ReferralComponent: React.FC<ReferralProps> = ({
  title,
  content,
  referralLink,
  onReferral,
  copyButtonLabel = 'Copy Referral Link',
  copiedMessage = 'Copied!',
  inputAriaLabel = 'Referral Link',
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const inputRef = useRef<HTMLInputElement>(null);

  // Using useCallback to memoize the handleCopy function
  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setCopied(true);
          onReferral(referralLink);
          setCopyError(null); // Clear any previous errors
        })
        .catch((err) => {
          console.error('Failed to copy referral link: ', err);
          setCopied(false);
          setCopyError(err);
          // Fallback to manual selection and copy if clipboard API fails
          if (inputRef.current) {
            inputRef.current.select();
            document.execCommand('copy'); // Deprecated, but useful as a fallback
            setCopied(true); // Indicate copy success even with fallback
            onReferral(referralLink);
          }
        });
    } else {
      // Fallback to manual selection and copy if clipboard API is not available
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy'); // Deprecated, but useful as a fallback
        setCopied(true); // Indicate copy success even with fallback
        onReferral(referralLink);
      } else {
        setCopyError(new Error('Unable to copy referral link'));
      }
    }
  }, [referralLink, onReferral]);

  // Using useEffect for the copied state timeout
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout on unmount or copied change
    }
  }, [copied]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputAriaLabel}
          ref={inputRef}
          onClick={(e) => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
        />
        <button
          onClick={handleCopy}
          disabled={copyError !== null}
          aria-label={copied ? copiedMessage : copyButtonLabel}
        >
          {copied ? copiedMessage : copyButtonLabel}
        </button>
        {copyError && (
          <p role="alert" style={{ color: 'red' }}>
            {copyError.message || 'Failed to copy. Please select and copy manually.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralComponent;