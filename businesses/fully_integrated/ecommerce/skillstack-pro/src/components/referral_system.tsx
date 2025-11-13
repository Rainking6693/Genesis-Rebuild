import React, { FC, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

interface Props {
  message: string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

const ReferralMessage: FC<Props> = ({ message, onSuccess, onError }) => {
  const [isReferring, setIsReferring] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const generateReferralCode = (): string | null => {
    if (!user) return null;

    // Implement a function to generate a unique referral code for each user
    // For example, you can use a combination of user ID, timestamp, and random characters
    try {
      return `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    } catch (error) {
      console.error('Error generating referral code:', error);
      return null;
    }
  };

  const handleRefer = async () => {
    setIsReferring(true);

    try {
      const referralCode = generateReferralCode();
      if (!referralCode) {
        throw new Error('Error generating referral code');
      }

      const response = await axios.post('/api/referral', {
        referrer: user?.id,
        referralCode,
      });

      if (response.status === 200) {
        onSuccess();
        setReferralCode(referralCode);
      }
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error(error);
      }
    } finally {
      setIsReferring(false);
    }
  };

  return (
    <div>
      <h3>Refer a Friend</h3>
      <p>{message}</p>
      {!isReferring ? (
        <>
          {referralCode && (
            <p>
              Your referral code: <strong>{referralCode}</strong>
            </p>
          )}
          <button onClick={handleRefer} aria-disabled={isReferring}>
            {isReferring ? 'Referring...' : 'Refer Now'}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default ReferralMessage;

In this updated version, I've added an edge case for when the user is not available, and I've also added a check to ensure that a referral code is generated before making the API call. I've also added ARIA attributes to the button to improve accessibility. Lastly, I've moved the error handling for generating the referral code inside the function to make it more maintainable.