import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralCardProps {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  onCopyLink: (copied: boolean) => void;
  onError?: (message: string) => void; // Optional error handler
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  referralLink,
  referralCount,
  onCopyLink,
  onError,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null); // State for copy errors
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null); // Use useRef for timeout ID
  const referralLinkInputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  useEffect(() => {
    if (isCopied) {
      timeoutId.current = setTimeout(() => {
        setIsCopied(false);
        onCopyLink(false);
      }, 3000);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isCopied, onCopyLink]);

  const handleCopyLink = useCallback(() => {
    try {
      if (!navigator.clipboard) {
        // Clipboard API not available (e.g., insecure context)
        console.warn('Clipboard API not available. Falling back to manual copy.');
        fallbackCopyTextToClipboard(referralLink);
        setIsCopied(true);
        onCopyLink(true);
      } else {
        navigator.clipboard.writeText(referralLink)
          .then(() => {
            setIsCopied(true);
            onCopyLink(true);
            setCopyError(null); // Clear any previous error
          })
          .catch(err => {
            console.error('Failed to copy referral link:', err);
            setCopyError('Failed to copy link. Please try again.');
            onCopyLink(false);
            if (onError) {
              onError('Failed to copy referral link.');
            }
          });
      }
    } catch (error: any) {
      console.error('Failed to copy referral link:', error);
      setCopyError('Failed to copy link. Please try again.');
      onCopyLink(false);
      if (onError) {
        onError('Failed to copy referral link.');
      }
    }
  }, [referralLink, onCopyLink, onError]);

  // Fallback function for browsers that don't support the Clipboard API
  const fallbackCopyTextToClipboard = (text: string) => {
    if (!referralLinkInputRef.current) {
      console.error('Input ref is not available for fallback copy.');
      setCopyError('Failed to copy link. Please select and copy manually.');
      if (onError) {
        onError('Failed to copy referral link.');
      }
      return;
    }

    referralLinkInputRef.current.select();
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        setCopyError('Failed to copy link. Please select and copy manually.');
        if (onError) {
          onError('Failed to copy referral link.');
        }
      }
    } catch (err) {
      setCopyError('Failed to copy link. Please select and copy manually.');
      if (onError) {
        onError('Failed to copy referral link.');
      }
    }
  };

  return (
    <div className="referral-card">
      <h3>Your Referral Code</h3>
      <p>{referralCode}</p>
      <h3>Your Referral Link</h3>
      <div className="referral-link-container">
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral link"
          ref={referralLinkInputRef}
          onClick={(e) => e.target.select()} // Select all text on click for easier manual copy
        />
        <button
          onClick={handleCopyLink}
          aria-label={isCopied ? 'Copied!' : 'Copy link'}
          disabled={isCopied} // Disable button while "Copied!" is displayed
        >
          {isCopied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      {copyError && <p className="error-message">{copyError}</p>} {/* Display error message */}
      <p>Referrals: {referralCount}</p>
    </div>
  );
};

export default ReferralCard;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralCardProps {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  onCopyLink: (copied: boolean) => void;
  onError?: (message: string) => void; // Optional error handler
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  referralLink,
  referralCount,
  onCopyLink,
  onError,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null); // State for copy errors
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null); // Use useRef for timeout ID
  const referralLinkInputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  useEffect(() => {
    if (isCopied) {
      timeoutId.current = setTimeout(() => {
        setIsCopied(false);
        onCopyLink(false);
      }, 3000);
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isCopied, onCopyLink]);

  const handleCopyLink = useCallback(() => {
    try {
      if (!navigator.clipboard) {
        // Clipboard API not available (e.g., insecure context)
        console.warn('Clipboard API not available. Falling back to manual copy.');
        fallbackCopyTextToClipboard(referralLink);
        setIsCopied(true);
        onCopyLink(true);
      } else {
        navigator.clipboard.writeText(referralLink)
          .then(() => {
            setIsCopied(true);
            onCopyLink(true);
            setCopyError(null); // Clear any previous error
          })
          .catch(err => {
            console.error('Failed to copy referral link:', err);
            setCopyError('Failed to copy link. Please try again.');
            onCopyLink(false);
            if (onError) {
              onError('Failed to copy referral link.');
            }
          });
      }
    } catch (error: any) {
      console.error('Failed to copy referral link:', error);
      setCopyError('Failed to copy link. Please try again.');
      onCopyLink(false);
      if (onError) {
        onError('Failed to copy referral link.');
      }
    }
  }, [referralLink, onCopyLink, onError]);

  // Fallback function for browsers that don't support the Clipboard API
  const fallbackCopyTextToClipboard = (text: string) => {
    if (!referralLinkInputRef.current) {
      console.error('Input ref is not available for fallback copy.');
      setCopyError('Failed to copy link. Please select and copy manually.');
      if (onError) {
        onError('Failed to copy referral link.');
      }
      return;
    }

    referralLinkInputRef.current.select();
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        setCopyError('Failed to copy link. Please select and copy manually.');
        if (onError) {
          onError('Failed to copy referral link.');
        }
      }
    } catch (err) {
      setCopyError('Failed to copy link. Please select and copy manually.');
      if (onError) {
        onError('Failed to copy referral link.');
      }
    }
  };

  return (
    <div className="referral-card">
      <h3>Your Referral Code</h3>
      <p>{referralCode}</p>
      <h3>Your Referral Link</h3>
      <div className="referral-link-container">
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral link"
          ref={referralLinkInputRef}
          onClick={(e) => e.target.select()} // Select all text on click for easier manual copy
        />
        <button
          onClick={handleCopyLink}
          aria-label={isCopied ? 'Copied!' : 'Copy link'}
          disabled={isCopied} // Disable button while "Copied!" is displayed
        >
          {isCopied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      {copyError && <p className="error-message">{copyError}</p>} {/* Display error message */}
      <p>Referrals: {referralCount}</p>
    </div>
  );
};

export default ReferralCard;