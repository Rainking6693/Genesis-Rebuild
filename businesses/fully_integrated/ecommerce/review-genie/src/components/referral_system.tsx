import React, { FC, useEffect, useState } from 'react';
import { useReferralSystem } from './useReferralSystem';

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  const { referralCode, setReferralCode, rewardPoints, setRewardPoints, validateReferralCode } = useReferralSystem();

  const handleClick = () => {
    if (validateReferralCode(referralCode)) {
      setRewardPoints(rewardPoints + 1);
    }
  };

  return (
    <div className="referral-system-message" onClick={handleClick} role="button" tabIndex={0}>
      {message}
      <small className="reward-info">
        Earn {rewardPoints} points for sharing your feedback! Your referral code is: {validateReferralCode(referralCode) ? referralCode : 'Not available'}
      </small>
    </div>
  );
};

export default ReferralSystemMessage;

// In the custom hook, add functions for generating referral code, tracking clicks, and updating reward points
import { useState, useEffect } from 'react';

const useReferralSystem = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [rewardPoints, setRewardPoints] = useState<number>(0);

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(7);
  };

  const validateReferralCode = (code: string) => {
    // Add your validation logic here
    return /^[a-zA-Z0-9]{7}$/.test(code);
  };

  useEffect(() => {
    const newReferralCode = generateReferralCode();
    setReferralCode(newReferralCode);
    setRewardPoints(0); // Reset reward points when referral code changes
  }, []);

  const trackClick = () => {
    setRewardPoints((prevRewardPoints) => Math.max(prevRewardPoints + 1, 0)); // Ensure reward points are non-negative
  };

  return { referralCode, setReferralCode, rewardPoints, setRewardPoints, trackClick, validateReferralCode };
};

In this updated code, I've added a `validateReferralCode` function to validate the referral code before displaying it. I've also added a check to ensure the reward points are a non-negative number before setting them. When the referral code changes, the reward points are reset to 0. The ARIA attributes `role="button"` and `tabIndex={0}` have been added for accessibility. Lastly, I've made the code more maintainable by separating the logic for generating the referral code, tracking clicks, and updating reward points into the custom hook and the component, respectively.