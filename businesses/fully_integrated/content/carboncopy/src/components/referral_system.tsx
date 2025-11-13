import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedButtonLabel?: string; // Customizable copied button label
  inputFieldLabel?: string; // Customizable input field label
  errorMessage?: string; // Customizable error message
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
  copyButtonLabel = 'Copy Link',
  copiedButtonLabel = 'Copied!',
  inputFieldLabel = 'Referral Link',
  errorMessage = 'Failed to copy referral link:',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Use useRef for timer
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCopied) {
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  const handleCopyReferralLink = useCallback(() => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(referralLink)
          .then(() => {
            setIsCopied(true);
            setCopyError(null); // Clear any previous errors
            onReferralClick();
          })
          .catch((err) => {
            console.error(errorMessage, err);
            setCopyError(err);
            setIsCopied(false);
          });
      } else {
        // Fallback for browsers that don't support Clipboard API
        // Select the text field
        if (inputRef.current) {
          inputRef.current.select();
          inputRef.current.focus(); // Optional: Focus the input for better UX on some browsers

          // For mobile devices
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);

          // Copy the text inside the text field
          document.execCommand('copy');
          setIsCopied(true);
          setCopyError(null);
          onReferralClick();
        } else {
          const error = new Error("Clipboard API not supported and input ref is null.");
          console.error(errorMessage, error);
          setCopyError(error);
          setIsCopied(false);
        }
      }
    } catch (error: any) {
      console.error(errorMessage, error);
      setCopyError(error);
      setIsCopied(false);
    }
  }, [referralLink, onReferralClick, errorMessage]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          ref={inputRef}
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputFieldLabel}
          aria-describedby="referral-link-description"
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? copiedButtonLabel : copyButtonLabel}
          disabled={!referralLink} // Disable button if referralLink is empty
        >
          {isCopied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
      <small id="referral-link-description">
      </small>
      {copyError && (
        <div role="alert" style={{ color: 'red' }}>
          {errorMessage} {copyError.message}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedButtonLabel?: string; // Customizable copied button label
  inputFieldLabel?: string; // Customizable input field label
  errorMessage?: string; // Customizable error message
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
  copyButtonLabel = 'Copy Link',
  copiedButtonLabel = 'Copied!',
  inputFieldLabel = 'Referral Link',
  errorMessage = 'Failed to copy referral link:',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Use useRef for timer
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCopied) {
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  const handleCopyReferralLink = useCallback(() => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(referralLink)
          .then(() => {
            setIsCopied(true);
            setCopyError(null); // Clear any previous errors
            onReferralClick();
          })
          .catch((err) => {
            console.error(errorMessage, err);
            setCopyError(err);
            setIsCopied(false);
          });
      } else {
        // Fallback for browsers that don't support Clipboard API
        // Select the text field
        if (inputRef.current) {
          inputRef.current.select();
          inputRef.current.focus(); // Optional: Focus the input for better UX on some browsers

          // For mobile devices
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);

          // Copy the text inside the text field
          document.execCommand('copy');
          setIsCopied(true);
          setCopyError(null);
          onReferralClick();
        } else {
          const error = new Error("Clipboard API not supported and input ref is null.");
          console.error(errorMessage, error);
          setCopyError(error);
          setIsCopied(false);
        }
      }
    } catch (error: any) {
      console.error(errorMessage, error);
      setCopyError(error);
      setIsCopied(false);
    }
  }, [referralLink, onReferralClick, errorMessage]);

  return (
    <div role="region" aria-label="Referral Information">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          ref={inputRef}
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputFieldLabel}
          aria-describedby="referral-link-description"
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? copiedButtonLabel : copyButtonLabel}
          disabled={!referralLink} // Disable button if referralLink is empty
        >
          {isCopied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
      <small id="referral-link-description">
      </small>
      {copyError && (
        <div role="alert" style={{ color: 'red' }}>
          {errorMessage} {copyError.message}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;