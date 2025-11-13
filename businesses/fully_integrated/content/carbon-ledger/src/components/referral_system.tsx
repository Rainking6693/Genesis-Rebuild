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
  inputFieldLabel = 'Referral link',
  errorMessage = 'Failed to copy referral link:',
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [copied]);

  const handleCopyLink = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        // Clipboard API not available (e.g., insecure context)
        console.warn('Clipboard API not available. Falling back to manual copy.');
        fallbackCopyTextToClipboard(referralLink);
        setCopied(true);
      } else {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
      }
      onReferralClick();
      setCopyError(null); // Clear any previous error
    } catch (error: any) {
      console.error(errorMessage, error);
      setCopyError(error);
      setCopied(false); // Ensure 'Copied!' doesn't show on error
    }
  }, [referralLink, onReferralClick, errorMessage]);

  // Fallback for browsers that don't support the Clipboard API (e.g., older browsers, insecure contexts)
  const fallbackCopyTextToClipboard = (text: string) => {
    if (!inputRef.current) {
      console.error('Input ref is not available for fallback copy.');
      return;
    }

    inputRef.current.select();
    inputRef.current.focus(); // Required for mobile Safari
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        console.error('Fallback: Copying text command was unsuccessful');
        setCopyError(new Error('Fallback copy failed'));
      }
    } catch (err: any) {
      console.error('Fallback: Oops, unable to copy', err);
      setCopyError(err);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputFieldLabel}
          data-testid="referral-link-input"
          ref={inputRef}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.select(); // Select text on click for easier manual copy
            }
          }}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          data-testid="copy-link-button"
          disabled={copyError !== null} // Disable button if there's an error
        >
          {copied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
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
  inputFieldLabel = 'Referral link',
  errorMessage = 'Failed to copy referral link:',
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [copied]);

  const handleCopyLink = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        // Clipboard API not available (e.g., insecure context)
        console.warn('Clipboard API not available. Falling back to manual copy.');
        fallbackCopyTextToClipboard(referralLink);
        setCopied(true);
      } else {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
      }
      onReferralClick();
      setCopyError(null); // Clear any previous error
    } catch (error: any) {
      console.error(errorMessage, error);
      setCopyError(error);
      setCopied(false); // Ensure 'Copied!' doesn't show on error
    }
  }, [referralLink, onReferralClick, errorMessage]);

  // Fallback for browsers that don't support the Clipboard API (e.g., older browsers, insecure contexts)
  const fallbackCopyTextToClipboard = (text: string) => {
    if (!inputRef.current) {
      console.error('Input ref is not available for fallback copy.');
      return;
    }

    inputRef.current.select();
    inputRef.current.focus(); // Required for mobile Safari
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        console.error('Fallback: Copying text command was unsuccessful');
        setCopyError(new Error('Fallback copy failed'));
      }
    } catch (err: any) {
      console.error('Fallback: Oops, unable to copy', err);
      setCopyError(err);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label={inputFieldLabel}
          data-testid="referral-link-input"
          ref={inputRef}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.select(); // Select text on click for easier manual copy
            }
          }}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          data-testid="copy-link-button"
          disabled={copyError !== null} // Disable button if there's an error
        >
          {copied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
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