import React, { useRef, useState } from 'react';

interface Props {
  title: string;
  description: string;
  referralCode: string;
}

const ReferralSystem: React.FC<Props> = ({ title, description, referralCode }) => {
  const [copied, setCopied] = useState(false);
  const referralRef = useRef<HTMLInputElement | null>(null);

  const handleCopyToClipboard = () => {
    if (referralRef.current) {
      try {
        referralRef.current.select();
        document.execCommand('copy');
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error('Error copying referral code:', error);
      }
    }
  };

  // Added a check for null or undefined referralCode
  if (!referralCode) {
    return <div>No referral code provided.</div>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div>
        <input type="text" readOnly value={referralCode} ref={referralRef} />
        <button onClick={handleCopyToClipboard}>Copy Referral Code</button>
        {copied && <p>Referral Code copied!</p>}
      </div>
      {/* Added ARIA attributes for accessibility */}
      <div role="alert" aria-live="polite" hidden={!copied}>
        Referral Code copied!
      </div>
    </div>
  );
};

export default ReferralSystem;

import React, { useRef, useState } from 'react';

interface Props {
  title: string;
  description: string;
  referralCode: string;
}

const ReferralSystem: React.FC<Props> = ({ title, description, referralCode }) => {
  const [copied, setCopied] = useState(false);
  const referralRef = useRef<HTMLInputElement | null>(null);

  const handleCopyToClipboard = () => {
    if (referralRef.current) {
      try {
        referralRef.current.select();
        document.execCommand('copy');
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error('Error copying referral code:', error);
      }
    }
  };

  // Added a check for null or undefined referralCode
  if (!referralCode) {
    return <div>No referral code provided.</div>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div>
        <input type="text" readOnly value={referralCode} ref={referralRef} />
        <button onClick={handleCopyToClipboard}>Copy Referral Code</button>
        {copied && <p>Referral Code copied!</p>}
      </div>
      {/* Added ARIA attributes for accessibility */}
      <div role="alert" aria-live="polite" hidden={!copied}>
        Referral Code copied!
      </div>
    </div>
  );
};

export default ReferralSystem;