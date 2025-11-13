import React, { useState, useEffect, useCallback } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: (link: string) => void;
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };
  }, [copyTimeout]);

  const handleCopyLink = useCallback(() => {
    try {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setCopied(true);
          onReferralClick(referralLink);

          // Set a timeout to reset the copied state after 3 seconds
          setCopyTimeout(
            setTimeout(() => {
              setCopied(false);
            }, 3000)
          );
        })
        .catch((error) => {
          console.error('Failed to copy referral link:', error);
        });
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  }, [referralLink, onReferralClick]);

  return (
    <div role="region" aria-label="Referral Component">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral Link"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copied ? 'Link copied' : 'Copy Link'}
          disabled={!navigator.clipboard}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <p aria-live="polite">Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface ReferralComponentProps {
  title: string;
  content: string;
  referralLink: string;
  referralCount: number;
  onReferralClick: (link: string) => void;
}

const ReferralComponent: React.FC<ReferralComponentProps> = ({
  title,
  content,
  referralLink,
  referralCount,
  onReferralClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };
  }, [copyTimeout]);

  const handleCopyLink = useCallback(() => {
    try {
      navigator.clipboard
        .writeText(referralLink)
        .then(() => {
          setCopied(true);
          onReferralClick(referralLink);

          // Set a timeout to reset the copied state after 3 seconds
          setCopyTimeout(
            setTimeout(() => {
              setCopied(false);
            }, 3000)
          );
        })
        .catch((error) => {
          console.error('Failed to copy referral link:', error);
        });
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  }, [referralLink, onReferralClick]);

  return (
    <div role="region" aria-label="Referral Component">
      <h1>{title}</h1>
      <p>{content}</p>
      <div>
        <input
          type="text"
          value={referralLink}
          readOnly
          aria-label="Referral Link"
          onFocus={(e) => e.target.select()}
        />
        <button
          onClick={handleCopyLink}
          aria-label={copied ? 'Link copied' : 'Copy Link'}
          disabled={!navigator.clipboard}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <p aria-live="polite">Referral Count: {referralCount}</p>
    </div>
  );
};

export default ReferralComponent;