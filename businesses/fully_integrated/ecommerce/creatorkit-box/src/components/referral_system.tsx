import React, { useState, useEffect, useContext } from 'react';
import { validateReferralCode } from '../services/referralService';
import { UserContext, UserContextType } from '../contexts/UserContext';

interface Props {
  referralCode?: string;
}

interface User {
  id: string;
}

const ReferralSystem: React.FC<Props> = ({ referralCode }) => {
  const [message, setMessage] = useState('');
  const { user }: UserContextType = useContext(UserContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralCode || !user) return;

    try {
      const isValid = await validateReferralCode(referralCode, user.id);
      if (isValid) {
        setMessage('Referral code validated successfully! Enjoy your rewards.');
      } else {
        setMessage('Invalid referral code. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while validating the referral code. Please try again later.');
    }
  };

  useEffect(() => {
    if (!user) setMessage('Please log in to validate your referral code.');
  }, [user]);

  return (
    <div>
      {!user && <p>Please log in to validate your referral code.</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="referralCode">Enter your referral code:</label>
        <input
          type="text"
          id="referralCode"
          name="referralCode"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          aria-describedby="referralCode-error"
        />
        {message && <p id="referralCode-error">{message}</p>}
        <button type="submit">Validate</button>
      </form>
    </div>
  );
};

export default ReferralSystem;

import React, { useState, useEffect, useContext } from 'react';
import { validateReferralCode } from '../services/referralService';
import { UserContext, UserContextType } from '../contexts/UserContext';

interface Props {
  referralCode?: string;
}

interface User {
  id: string;
}

const ReferralSystem: React.FC<Props> = ({ referralCode }) => {
  const [message, setMessage] = useState('');
  const { user }: UserContextType = useContext(UserContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!referralCode || !user) return;

    try {
      const isValid = await validateReferralCode(referralCode, user.id);
      if (isValid) {
        setMessage('Referral code validated successfully! Enjoy your rewards.');
      } else {
        setMessage('Invalid referral code. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while validating the referral code. Please try again later.');
    }
  };

  useEffect(() => {
    if (!user) setMessage('Please log in to validate your referral code.');
  }, [user]);

  return (
    <div>
      {!user && <p>Please log in to validate your referral code.</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="referralCode">Enter your referral code:</label>
        <input
          type="text"
          id="referralCode"
          name="referralCode"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          aria-describedby="referralCode-error"
        />
        {message && <p id="referralCode-error">{message}</p>}
        <button type="submit">Validate</button>
      </form>
    </div>
  );
};

export default ReferralSystem;