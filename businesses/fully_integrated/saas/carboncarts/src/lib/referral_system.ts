import React, { FC, useCallback, useState } from 'react';

interface Props {
  referralMessage: string; // Use a more descriptive name for the prop to reflect its purpose in the context of CarbonCarts
  referralCode: string; // Always provide a referral code
  reward: string; // Add a prop for tracking rewards
  isCopied?: boolean; // Add a prop to track if the referral code has been copied
}

const ReferralComponent: FC<Props> = ({ referralMessage, referralCode, reward, isCopied = false }) => {
  const [copiedReferralCode, setCopiedReferralCode] = useState(isCopied);

  const handleCopyClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.textContent = 'Copied!';
    navigator.clipboard.writeText(referralCode);
    setCopiedReferralCode(true);
    setTimeout(() => {
      event.currentTarget.textContent = 'Copy Referral Code';
      setCopiedReferralCode(false);
    }, 2000);
  }, [referralCode]);

  return (
    <div>
      <h3>Refer a Friend and Get {reward}</h3>
      <p>{referralMessage}</p>
      <div>
        <span>{referralCode}</span>
        <button onClick={handleCopyClick}>{copiedReferralCode ? 'Copied!' : 'Copy Referral Code'}</button>
      </div>
    </div>
  );
};

// Import the ReferralComponent for use in other components
export { ReferralComponent };

import React, { FC, useCallback, useState } from 'react';

interface Props {
  referralMessage: string; // Use a more descriptive name for the prop to reflect its purpose in the context of CarbonCarts
  referralCode: string; // Always provide a referral code
  reward: string; // Add a prop for tracking rewards
  isCopied?: boolean; // Add a prop to track if the referral code has been copied
}

const ReferralComponent: FC<Props> = ({ referralMessage, referralCode, reward, isCopied = false }) => {
  const [copiedReferralCode, setCopiedReferralCode] = useState(isCopied);

  const handleCopyClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.textContent = 'Copied!';
    navigator.clipboard.writeText(referralCode);
    setCopiedReferralCode(true);
    setTimeout(() => {
      event.currentTarget.textContent = 'Copy Referral Code';
      setCopiedReferralCode(false);
    }, 2000);
  }, [referralCode]);

  return (
    <div>
      <h3>Refer a Friend and Get {reward}</h3>
      <p>{referralMessage}</p>
      <div>
        <span>{referralCode}</span>
        <button onClick={handleCopyClick}>{copiedReferralCode ? 'Copied!' : 'Copy Referral Code'}</button>
      </div>
    </div>
  );
};

// Import the ReferralComponent for use in other components
export { ReferralComponent };