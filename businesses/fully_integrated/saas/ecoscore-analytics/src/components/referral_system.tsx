import React, { FC, useState } from 'react';
import { ReferralSystemMessage } from './ReferralSystemMessage';
import crypto from 'crypto';

// Interface for ReferralData to store referral information
interface ReferralData {
  code: string;
  referrerId: string;
  newUserId: string;
  rewarded: boolean;
}

// Interface for ReferralSystemProps to pass props to ReferralSystem component
interface ReferralSystemProps {
  onReward: (data: ReferralData) => void;
}

// Centralize the component import for better organization and reusability
import { ReferralSystemMessage } from './ReferralSystemMessage';

// Create a function to generate unique referral codes for each user
const generateReferralCode = () => {
  return crypto.randomUUID();
};

// Create a function to handle referral submissions and track rewards
const handleReferralSubmission = async (code: string, referrerId: string) => {
  // Validate the referral code
  // Check if the code is valid and has not been used before
  // If valid, reward the referrer and the new user
  // Store the referral data for future reference and reporting

  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // You can replace this with your actual API call logic
  if (isValidReferralCode(code)) {
    const newUserId = getNewUserId(); // Get the new user's ID
    const referralData: ReferralData = { code, referrerId, newUserId, rewarded: false };
    rewardReferrerAndNewUser(referralData);
    referrerId && handleReferralSystemReward(referralData);
  }
};

// Helper function to check if the referral code is valid
const isValidReferralCode = (code: string) => {
  return code.length >= 10;
};

// Helper function to reward the referrer and the new user
const rewardReferrerAndNewUser = (referralData: ReferralData) => {
  console.log(`Rewarding user with referral code: ${referralData.code}`);
  referralData.rewarded = true;
};

// Helper function to get the new user's ID
const getNewUserId = () => {
  // Implement your logic to get the new user's ID
  // For example, you can use a UUID generator or store the ID in a state
  return crypto.randomUUID();
};

// Helper function to handle referral system rewards
const handleReferralSystemReward = (referralData: ReferralData) => {
  // Call the onReward prop function with the referral data
  // This allows the parent component to handle the rewarding process
  const { onReward } = props;
  onReward(referralData);
};

// Use the ReferralSystemMessage component to display referral-related messages
const ReferralSystem: FC<ReferralSystemProps> = ({ onReward }) => {
  const [referralCode, setReferralCode] = useState('');

  const handleGenerateCode = () => {
    setReferralCode(generateReferralCode());
  };

  const handleSubmit = () => {
    const referrerId = getCurrentUserID(); // Get the current user's ID
    handleReferralSubmission(referralCode, referrerId);
  };

  return (
    <div>
      <ReferralSystemMessage id="referral-message-1" message="Generate your unique referral code:" />
      <button onClick={handleGenerateCode}>Generate Code</button>
      <ReferralSystemMessage id="referral-message-2" message="Enter the referral code:" />
      <input
        type="text"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Referral</button>
    </div>
  );
};

// Helper function to get the current user's ID
const getCurrentUserID = () => {
  // Implement your logic to get the current user's ID
  // For example, you can use a UUID generator or store the ID in a state
  return crypto.randomUUID();
};

export default ReferralSystem;

In this updated code, I've made the following improvements:

1. Added a `ReferralData` interface to store referral information.
2. Modified the `handleReferralSubmission` function to accept the referrer's ID and get the new user's ID.
3. Created a `handleReferralSystemReward` function to handle the rewarding process and call the `onReward` prop function.
4. Added a `getCurrentUserID` function to get the current user's ID.
5. Passed the `onReward` prop to the `ReferralSystem` component to allow the parent component to handle the rewarding process.
6. Added a `getNewUserId` function to get the new user's ID, which can be replaced with your actual implementation.
7. Added a `ReferralSystemProps` interface to define the props for the `ReferralSystem` component.