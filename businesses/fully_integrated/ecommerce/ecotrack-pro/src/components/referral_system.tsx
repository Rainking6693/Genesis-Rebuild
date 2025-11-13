import React, { FC, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  children: ReactNode;
  className?: string;
}

const ReferralSystemMessage: FC<Props> = ({ children, className }) => {
  return <div className={`referral-system-message ${className}`}>{children}</div>;
};

interface ReferralSystemProps {
  referralCode?: string;
  referralMessage?: string;
  onReferralCodeChange?: (referralCode: string) => void;
}

const ReferralCodeInput: FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="referral-code"
      aria-label="Referral Code"
    />
  );
};

const ReferralSystem: FC<ReferralSystemProps> = ({ referralCode, referralMessage, onReferralCodeChange }) => {
  // Adding validation for referral code to prevent potential security issues
  const [isValidReferralCode, setIsValidReferralCode] = useState(false);

  const handleReferralCodeChange = (referralCode: string) => {
    if (isValidReferralCodeCode(referralCode)) {
      setIsValidReferralCode(true);
    } else {
      setIsValidReferralCode(false);
    }
    if (onReferralCodeChange) {
      onReferralCodeChange(referralCode);
    }
  };

  return (
    <div className="referral-system">
      <ReferralSystemMessage message={referralMessage} />
      {referralCode ? (
        <ReferralCode value={referralCode} />
      ) : (
        <ReferralCodeInput value={referralCode || ''} onChange={handleReferralCodeChange} />
      )}
    </div>
  );
};

const ReferralCode: FC<{ value: string }> = ({ value }) => {
  // Adding unique ID for each referral code to prevent duplicates
  const uniqueId = uuidv4();
  return <div className={`referral-code ${value}`} id={uniqueId}>{value}</div>;
};

// Adding a function to check if the referral code is valid
function isValidReferralCode(referralCode: string): boolean {
  // Implement validation logic here
  // For example, you can check if the length of the referral code is within a certain range
  return referralCode.length >= 5 && referralCode.length <= 10;
}

// Wrapping the referral system with a div and providing a role and aria-label for better accessibility
const ReferralSystemWrapper: FC<ReferralSystemProps> = ({ referralCode, referralMessage, onReferralCodeChange }) => {
  return (
    <div role="presentation" aria-label="Referral System">
      <ReferralSystem referralCode={referralCode} referralMessage={referralMessage} onReferralCodeChange={onReferralCodeChange} />
    </div>
  );
};

export default ReferralSystemWrapper;

In this updated code, I've added a state to track the validity of the referral code, and I've made the `ReferralSystem` component accept an `onReferralCodeChange` prop to handle changes in the referral code. I've also added a `ReferralCodeInput` component to handle user input for the referral code. Additionally, I've moved the validation logic for the referral code into a separate function for better maintainability. Lastly, I've wrapped the `ReferralSystem` component with a div and provided a role and aria-label for better accessibility.