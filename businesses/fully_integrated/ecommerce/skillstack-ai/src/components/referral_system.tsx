import React, { FC, useState } from 'react';

type ReferralMessageProps = {
  message?: string; // Added optional prop for message
};

const ReferralMessageComponent: FC<ReferralMessageProps> = ({ message }) => {
  if (!message) {
    message = ReferralMessageComponent.defaultProps.message; // Use default prop if no message provided
  }
  return <div>{message}</div>;
};

ReferralMessageComponent.defaultProps = {
  message: 'Refer a friend and get a discount!',
};

type ReferralCodeFormProps = {};

const ReferralCodeForm: FC<ReferralCodeFormProps> = () => {
  const [referralCode, setReferralCode] = useState('');

  const handleReferralCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReferralCode(event.target.value.trim()); // Trim whitespace for better handling
  };

  const handleReferralCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!referralCode.length) {
      alert('Please enter a valid referral code.');
      return;
    }
    // Handle referral code submission here
  };

  return (
    <form onSubmit={handleReferralCodeSubmit}>
      <ReferralCodeInput aria-label="Enter referral code" onChange={handleReferralCodeChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

const ReferralCodeInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = React.memo((props) => (
  <input {...props} />
));

ReferralCodeInput.defaultProps = {
  ariaLabel: 'Enter referral code',
};

export default ReferralMessageComponent;
export { ReferralCodeForm };

Changes made:

1. Added an optional message prop to the `ReferralMessageComponent` with a default value.
2. Trimmed whitespace from the input value in the `handleReferralCodeChange` function.
3. Added an `aria-label` to the `ReferralCodeInput` for better accessibility.
4. Improved the error message for an empty referral code.
5. Added comments for better maintainability.