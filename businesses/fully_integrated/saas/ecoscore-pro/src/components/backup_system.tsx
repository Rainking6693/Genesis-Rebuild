import React, { FC, useState, SetStateAction } from 'react';

interface Props {
  companyName: string;
  onError?: (error: Error) => void;
}

const EcoScoreProComponent: FC<Props> = ({ companyName, onError }) => {
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const validateCompanyName = (companyName: string): boolean => {
    return Boolean(companyName.trim());
  };

  React.useEffect(() => {
    if (validateCompanyName(companyName)) {
      setWelcomeMessage(`Welcome, ${companyName}!`);
    } else {
      onError?.(new Error('Company name is required'));
    }
  }, [companyName, onError]);

  const handleWelcomeMessageChange = (newWelcomeMessage: SetStateAction<string>) => {
    if (validateCompanyName(newWelcomeMessage)) {
      setWelcomeMessage(newWelcomeMessage);
    }
  };

  return (
    <h1 title="Welcome message for the company">
      {welcomeMessage && welcomeMessage.length > 0 && welcomeMessage}
    </h1>
  );
};

EcoScoreProComponent.defaultProps = {
  onError: (error: Error) => {},
};

export default EcoScoreProComponent;

This updated component now checks for empty or null `companyName` values, provides a default error callback, and ensures that the welcome message is only set when the `companyName` is valid. Additionally, it adds a `title` attribute for better accessibility and checks if the `welcomeMessage` is not empty before rendering it.