import React, { createContext, FC, useContext } from 'react';

// Create a validation context to centralize validation logic
interface ValidationContextValue {
  validate: (value: string) => string;
}
const ValidationContext = createContext<ValidationContextValue>({
  validate: (value) => value,
});

// Use the validation context to validate the referral message
const useValidateReferralMessage = () => {
  const { validate } = useContext(ValidationContext);

  return (referralMessage: string) => {
    if (!referralMessage || referralMessage.trim().length === 0) {
      throw new Error('Referral message cannot be empty');
    }

    return validate(referralMessage);
  };
};

const validateReferralMessage = useValidateReferralMessage();

// Custom hook to handle validation errors
const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
  };

  return { error, handleError };
};

// ReferralComponent with error handling
const ReferralComponent: FC<{ referralMessage: string; error?: Error }> = ({ referralMessage, error }) => {
  return (
    <div>
      {referralMessage}
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </div>
  );
};

const ReferralSystem: FC = () => {
  const { provider: validate } = useContext(ValidationContext);
  const { error, handleError } = useErrorHandler();

  const referralMessage = validate('Refer a friend and earn carbon credits!'); // Example referral message

  React.useEffect(() => {
    try {
      validateReferralMessage(referralMessage);
    } catch (error) {
      handleError(error);
    }
  }, [referralMessage, validateReferralMessage, validate]);

  return <ReferralComponent referralMessage={referralMessage} error={error} />;
};

// Wrap the ReferralSystem component with the validation context provider
const ValidatedReferralSystem: FC = () => {
  const validate = (value: string) => {
    // Implement validation logic here, such as checking for empty strings or invalid characters
    return value;
  };

  return (
    <ValidationContext.Provider value={{ validate }}>
      <ReferralSystem />
    </ValidationContext.Provider>
  );
};

export default ValidatedReferralSystem;

In this updated code:

1. I've created a `ValidationContextValue` interface to better define the context value type.
2. I've added an error handling custom hook (`useErrorHandler`) to manage validation errors.
3. I've updated the `ReferralComponent` to accept an `error` prop and display it if present.
4. I've added an effect hook to `ReferralSystem` to validate the referral message whenever it changes.
5. I've updated the validation logic in the `validateReferralMessage` function to throw an error if the referral message is empty.
6. I've added a default validation function in the `ValidationContext` provider that simply returns the input value. This allows users of the component to provide their own validation logic.

These changes make the code more resilient, handle edge cases better, improve accessibility by providing error messages, and make the code more maintainable by separating concerns and providing clear interfaces.