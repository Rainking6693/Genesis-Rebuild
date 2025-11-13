import React, { FC, ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const ReferralSystemMessage: FC<Props> = ({ children, className }) => {
  return <div className={`referral-message ${className || ''}`}>{children}</div>;
};

interface ReferralSystemProps {
  referralCode: string;
  referralMessage: string;
  className?: string;
}

const ReferralSystem: FC<ReferralSystemProps> = ({ referralCode, referralMessage, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`referral-system ${className || ''}`}>
      <ReferralSystemMessage
        className="referral-code"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
      >
        {copied ? (
          <>
            Copied! <span aria-hidden={true}>{referralCode}</span>
          </>
        ) : (
          <>
            Join EcoTrack Pro with referral code: <span aria-hidden={true}>{referralCode}</span>
          </>
        )}
      </ReferralSystemMessage>
      <ReferralSystemMessage>{referralMessage}</ReferralSystemMessage>
    </div>
  );
};

export default ReferralSystem;

import React, { FC, ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const ReferralSystemMessage: FC<Props> = ({ children, className }) => {
  return <div className={`referral-message ${className || ''}`}>{children}</div>;
};

interface ReferralSystemProps {
  referralCode: string;
  referralMessage: string;
  className?: string;
}

const ReferralSystem: FC<ReferralSystemProps> = ({ referralCode, referralMessage, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`referral-system ${className || ''}`}>
      <ReferralSystemMessage
        className="referral-code"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
      >
        {copied ? (
          <>
            Copied! <span aria-hidden={true}>{referralCode}</span>
          </>
        ) : (
          <>
            Join EcoTrack Pro with referral code: <span aria-hidden={true}>{referralCode}</span>
          </>
        )}
      </ReferralSystemMessage>
      <ReferralSystemMessage>{referralMessage}</ReferralSystemMessage>
    </div>
  );
};

export default ReferralSystem;