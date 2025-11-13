import React, { FC, useState } from 'react';

type ValidationFunction = (value: string) => boolean;

interface Props {
  message?: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const fallbackMessage = 'Welcome to GreenTrack Pro! Refer us to earn rewards.';
  const messageToDisplay = message || fallbackMessage;

  return (
    <div>
      {messageToDisplay}
      <br />
      <small>
        Refer a friend and earn rewards!
      </small>
    </div>
  );
};

ReferralMessage.defaultProps = {
  message: undefined,
};

interface ReferralFormProps {
  onSubmit: (message: string) => void;
}

const ReferralForm: FC<ReferralFormProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const isMessageValid: ValidationFunction = (value) => value.trim() !== '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMessageValid(message)) {
      alert('Please enter a valid referral message.');
      return;
    }
    onSubmit(message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="message">Your referral message:</label>
      <input
        type="text"
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        aria-required="true"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export { ReferralMessage, ReferralForm };

In this updated code, I've added an error handling mechanism for form submission, a validation function to check if the input is empty or not, ARIA attributes for accessibility, a default value for the `message` state, and type annotations for the event parameters and the `HTMLFormElement` in the `onSubmit` prop. These changes make the components more robust, flexible, and easier to maintain.