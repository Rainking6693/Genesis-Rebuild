import React, { useEffect, useState, useRef } from 'react';

interface Props {
  title: string;
  description: string;
  referralCode: string;
  onReferralSubmit: (code: string) => void;
}

const ReferralSystem: React.FC<Props> = ({ title, description, referralCode, onReferralSubmit }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      onReferralSubmit(enteredCode);
      formRef.current.reset();
    }
  };

  useEffect(() => {
    if (enteredCode.trim() === '') {
      setEnteredCode(referralCode);
    }
  }, [referralCode]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <label htmlFor="referral-code">Enter your referral code</label>
        <input type="text" id="referral-code" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} placeholder="Enter your referral code" aria-describedby="referral-code-description" />
        <p id="referral-code-description">Your current entered code: {enteredCode}</p>
        <button type="submit">Submit</button>
      </form>
      <p>Your referral code: {referralCode}</p>
    </div>
  );
};

export default ReferralSystem;

import React, { useEffect, useState, useRef } from 'react';

interface Props {
  title: string;
  description: string;
  referralCode: string;
  onReferralSubmit: (code: string) => void;
}

const ReferralSystem: React.FC<Props> = ({ title, description, referralCode, onReferralSubmit }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      onReferralSubmit(enteredCode);
      formRef.current.reset();
    }
  };

  useEffect(() => {
    if (enteredCode.trim() === '') {
      setEnteredCode(referralCode);
    }
  }, [referralCode]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <label htmlFor="referral-code">Enter your referral code</label>
        <input type="text" id="referral-code" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} placeholder="Enter your referral code" aria-describedby="referral-code-description" />
        <p id="referral-code-description">Your current entered code: {enteredCode}</p>
        <button type="submit">Submit</button>
      </form>
      <p>Your referral code: {referralCode}</p>
    </div>
  );
};

export default ReferralSystem;