import React, { useContext, useState } from 'react';
import { WellnessStackContext } from '../../contexts/WellnessStackContext';

interface Props {
  initialReferralCode?: string;
}

const ReferralSystem: React.FC<Props> = ({ initialReferralCode }) => {
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  const { setReferralCode: setContextReferralCode } = useContext(WellnessStackContext);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();
    setReferralCode(inputValue);
    setContextReferralCode(inputValue);
  };

  const handleCodeBlur = () => {
    if (!referralCode.length) {
      setReferralCode('');
      setContextReferralCode(null);
    }
  };

  const handleCodeInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.trim();
  };

  return (
    <div>
      <h2>Refer a Friend</h2>
      <input
        type="text"
        value={referralCode || ''}
        onChange={handleCodeChange}
        onBlur={handleCodeBlur}
        onInput={handleCodeInput}
        aria-label="Enter your referral code"
        placeholder="Enter your referral code"
        required
      />
      {referralCode && <p>Your referral code is: {referralCode}</p>}
    </div>
  );
};

export default ReferralSystem;

import React, { useContext, useState } from 'react';
import { WellnessStackContext } from '../../contexts/WellnessStackContext';

interface Props {
  initialReferralCode?: string;
}

const ReferralSystem: React.FC<Props> = ({ initialReferralCode }) => {
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  const { setReferralCode: setContextReferralCode } = useContext(WellnessStackContext);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim();
    setReferralCode(inputValue);
    setContextReferralCode(inputValue);
  };

  const handleCodeBlur = () => {
    if (!referralCode.length) {
      setReferralCode('');
      setContextReferralCode(null);
    }
  };

  const handleCodeInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.trim();
  };

  return (
    <div>
      <h2>Refer a Friend</h2>
      <input
        type="text"
        value={referralCode || ''}
        onChange={handleCodeChange}
        onBlur={handleCodeBlur}
        onInput={handleCodeInput}
        aria-label="Enter your referral code"
        placeholder="Enter your referral code"
        required
      />
      {referralCode && <p>Your referral code is: {referralCode}</p>}
    </div>
  );
};

export default ReferralSystem;