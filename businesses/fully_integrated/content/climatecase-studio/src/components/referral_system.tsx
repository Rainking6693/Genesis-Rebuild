import React, { useState, useEffect, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedButtonLabel?: string; // Customizable copied button label
  copyTimeout?: number; // Customizable timeout for "Copied!" message
  inputAriaLabel?: string; // Aria label for the referral link input
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
  copyButtonLabel = 'Copy Link',
  copiedButtonLabel = 'Copied!',
  copyTimeout = 3000,
  inputAriaLabel = 'Referral Link',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input element

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, copyTimeout);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCopied, copyTimeout]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      onReferralClick();
      setCopyError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Failed to copy referral link: ', err);
      setCopyError(err);
      setIsCopied(false); // Ensure 'Copied!' doesn't show on error
      // Fallback for browsers that don't support navigator.clipboard
      if (document.queryCommandSupported('copy')) {
        if (inputRef.current) {
          inputRef.current.select();
          document.execCommand('copy');
          setIsCopied(true);
          onReferralClick();
          setCopyError(null);
        } else {
          console.error("Input ref is null.  Can't use fallback copy.");
          setCopyError(new Error("Failed to copy link. Input element not found."));
        }
      } else {
        console.error("Copy command not supported.");
        setCopyError(new Error("Copying not supported in this browser."));
      }
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
          aria-label={inputAriaLabel}
          ref={inputRef}
          onClick={(e) => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? copiedButtonLabel : copyButtonLabel}
          disabled={copyError !== null}
        >
          {isCopied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
      {copyError && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {copyError.message}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: () => void;
  copyButtonLabel?: string; // Customizable copy button label
  copiedButtonLabel?: string; // Customizable copied button label
  copyTimeout?: number; // Customizable timeout for "Copied!" message
  inputAriaLabel?: string; // Aria label for the referral link input
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
  copyButtonLabel = 'Copy Link',
  copiedButtonLabel = 'Copied!',
  copyTimeout = 3000,
  inputAriaLabel = 'Referral Link',
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<Error | null>(null); // State for copy errors
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input element

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, copyTimeout);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCopied, copyTimeout]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      onReferralClick();
      setCopyError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Failed to copy referral link: ', err);
      setCopyError(err);
      setIsCopied(false); // Ensure 'Copied!' doesn't show on error
      // Fallback for browsers that don't support navigator.clipboard
      if (document.queryCommandSupported('copy')) {
        if (inputRef.current) {
          inputRef.current.select();
          document.execCommand('copy');
          setIsCopied(true);
          onReferralClick();
          setCopyError(null);
        } else {
          console.error("Input ref is null.  Can't use fallback copy.");
          setCopyError(new Error("Failed to copy link. Input element not found."));
        }
      } else {
        console.error("Copy command not supported.");
        setCopyError(new Error("Copying not supported in this browser."));
      }
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
          aria-label={inputAriaLabel}
          ref={inputRef}
          onClick={(e) => {
            if (inputRef.current) {
              inputRef.current.select();
            }
          }}
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? copiedButtonLabel : copyButtonLabel}
          disabled={copyError !== null}
        >
          {isCopied ? copiedButtonLabel : copyButtonLabel}
        </button>
      </div>
      {copyError && (
        <div role="alert" style={{ color: 'red' }}>
          Error: {copyError.message}
        </div>
      )}
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;