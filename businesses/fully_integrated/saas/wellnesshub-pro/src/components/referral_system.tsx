import React, { FC, useRef, useState } from 'react';

interface Props {
  message: string;
}

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  return (
    <div className="referral-system-message" role="alert">
      {message}
      <a href="#" className="refer-friend-link" role="button">Refer a friend</a>
    </div>
  );
};

interface ReferralSystemProps {
  referralMessage: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ referralMessage }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await sendReferralRequest();
      setSuccessMessage('Referral request sent successfully!');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const validateForm = () => {
    // Validate form fields
    // ...
    return true;
  };

  const sendReferralRequest = async () => {
    try {
      const response = await fetch('/api/referral', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Referral request failed');
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  const showSuccessMessage = () => {
    // Display success message to user
    setSuccessMessage('Referral request sent successfully!');
  };

  const showErrorMessage = (error: Error) => {
    // Display error message to user
    setErrorMessage(error.message);
  };

  return (
    <div className="referral-system">
      <ReferralSystemMessage message={referralMessage} />
      <form className="referral-form" ref={formRef} onSubmit={handleSubmit}>
        {/* Implement form for user to input friend's email */}
      </form>
      {successMessage && <div className="success-message" role="alert">{successMessage}</div>}
      {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
    </div>
  );
};

export default ReferralSystem;

In this updated code, I've added ARIA roles for accessibility, moved the success and error messages inside the `ReferralSystem` component for better organization, and used the `useState` and `useRef` hooks for better state management and form handling. I've also refactored the `sendReferralRequest` function to use the `async/await` syntax for making requests, which is more modern and easier to read. Additionally, I've wrapped the success and error messages with ARIA roles to improve accessibility.