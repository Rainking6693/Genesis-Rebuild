import React, { FC, ReactNode, useState } from 'react';

interface ReferralCodeMessageProps {
  referralCode?: string | null;
  message: string;
}

const ReferralCodeMessage: FC<ReferralCodeMessageProps> = ({ referralCode, message }) => {
  return (
    <div className="referral-message">
      {message}
      {referralCode && ` (Use referral code: ${referralCode})`}
    </div>
  );
};

interface ReferralSystemProps {
  children?: ReactNode;
  referralCode?: string;
  referralMessage?: string;
}

const ReferralSystem: FC<ReferralSystemProps> = ({ children, referralCode, referralMessage }) => {
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(!!referralCode);

  const handleReferralCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsReferralCodeValid(event.target.value.length > 0);
  };

  return (
    <div className="referral-system">
      <div>{children}</div>
      {isReferralCodeValid && (
        <ReferralCodeMessage referralCode={referralCode} message="Join CarbonCopy AI today and get a special offer!" />
      )}
      {referralMessage && (
        <ReferralCodeMessage referralCode={null} message={referralMessage} />
      )}
      {!isReferralCodeValid && (
        <div className="referral-input-container">
          <label htmlFor="referral-code">Enter your referral code:</label>
          <input
            type="text"
            id="referral-code"
            name="referral-code"
            placeholder="Enter your referral code"
            onChange={handleReferralCodeChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;

import React, { FC, ReactNode, useState } from 'react';

interface ReferralCodeMessageProps {
  referralCode?: string | null;
  message: string;
}

const ReferralCodeMessage: FC<ReferralCodeMessageProps> = ({ referralCode, message }) => {
  return (
    <div className="referral-message">
      {message}
      {referralCode && ` (Use referral code: ${referralCode})`}
    </div>
  );
};

interface ReferralSystemProps {
  children?: ReactNode;
  referralCode?: string;
  referralMessage?: string;
}

const ReferralSystem: FC<ReferralSystemProps> = ({ children, referralCode, referralMessage }) => {
  const [isReferralCodeValid, setIsReferralCodeValid] = useState(!!referralCode);

  const handleReferralCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsReferralCodeValid(event.target.value.length > 0);
  };

  return (
    <div className="referral-system">
      <div>{children}</div>
      {isReferralCodeValid && (
        <ReferralCodeMessage referralCode={referralCode} message="Join CarbonCopy AI today and get a special offer!" />
      )}
      {referralMessage && (
        <ReferralCodeMessage referralCode={null} message={referralMessage} />
      )}
      {!isReferralCodeValid && (
        <div className="referral-input-container">
          <label htmlFor="referral-code">Enter your referral code:</label>
          <input
            type="text"
            id="referral-code"
            name="referral-code"
            placeholder="Enter your referral code"
            onChange={handleReferralCodeChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;