import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: () => void;
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyReferralLink = useCallback(() => {
    try {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setIsCopied(true);
          onReferralClick();
          copyTimeoutRef.current = setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        })
        .catch((error) => {
          console.error('Failed to copy referral link:', error);
        });
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  }, [referralLink, onReferralClick]);

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
          data-testid="referral-link-input"
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? 'Copied!' : 'Copy link'}
          data-testid="copy-link-button"
        >
          {isCopied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
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
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyReferralLink = useCallback(() => {
    try {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setIsCopied(true);
          onReferralClick();
          copyTimeoutRef.current = setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        })
        .catch((error) => {
          console.error('Failed to copy referral link:', error);
        });
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  }, [referralLink, onReferralClick]);

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
          data-testid="referral-link-input"
        />
        <button
          onClick={handleCopyReferralLink}
          aria-label={isCopied ? 'Copied!' : 'Copy link'}
          data-testid="copy-link-button"
        >
          {isCopied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <p>Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;