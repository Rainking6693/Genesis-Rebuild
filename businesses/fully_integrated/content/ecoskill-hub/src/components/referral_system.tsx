import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

type AuthContextData = Partial<Record<keyof typeof user, any>> & {
  isLoading: boolean;
  error: Error | null;
};

type Props = {
  message: string;
} & Omit<AuthContextData, 'user'>;

const ReferralSystem: React.FC<Props> = ({ message, user, isLoading, error }) => {
  const referralRef = useRef<HTMLDivElement>(null);
  const [isReferralSent, setIsReferralSent] = useState(false);
  const sendReferralData = useCallback(async (user: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log('Referral sent successfully:', data);
      setIsLoading(false);
      setIsReferralSent(true);
    } catch (error) {
      console.error('Error sending referral:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && !isReferralSent) {
      sendReferralData(user);
      setIsReferralSent(true);
    }
  }, [user, isReferralSent, sendReferralData]);

  return (
    <div ref={referralRef} aria-busy={isLoading}>
      {message}
      {isLoading && <span>Sending referral...</span>}
      {error && <span>Error: {error.message}</span>}
      {isReferralSent && <span>Referral sent!</span>}
    </div>
  );
};

export default ReferralSystem;