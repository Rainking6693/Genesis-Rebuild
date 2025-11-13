import React, { useState, useEffect } from 'react';
import { sanitizeUserInput } from '../../security/sanitization';
import { useMindfulSales } from './useMindfulSales';

interface Props {
  message: string;
}

interface PersonalizationData {
  mood?: string;
  crmData?: any;
}

const personalizeMessage = (baseMessage: string, personalizationData: PersonalizationData) => {
  let personalizedMessage = baseMessage;

  if (personalizationData.mood === 'happy') {
    personalizedMessage += ' You are doing great! Keep up the good work.';
  } else if (personalizationData.mood === 'sad') {
    personalizedMessage += ' Remember, every cloud has a silver lining. Keep pushing.';
  }

  // Add more logic to personalize the message based on the user's mood and CRM data

  return personalizedMessage;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [personalizedMessage, setPersonalizedMessage] = useState<string>(message);
  const { mood, crmData } = useMindfulSales();

  useEffect(() => {
    if (mood && crmData) {
      const personalized = personalizeMessage(message, { mood, crmData });
      setPersonalizedMessage(personalized);
    }
  }, [mood, crmData]);

  const sanitizedMessage = sanitizeUserInput(personalizedMessage);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { sanitizeUserInput } from '../../security/sanitization';
import { useMindfulSales } from './useMindfulSales';

interface Props {
  message: string;
}

interface PersonalizationData {
  mood?: string;
  crmData?: any;
}

const personalizeMessage = (baseMessage: string, personalizationData: PersonalizationData) => {
  let personalizedMessage = baseMessage;

  if (personalizationData.mood === 'happy') {
    personalizedMessage += ' You are doing great! Keep up the good work.';
  } else if (personalizationData.mood === 'sad') {
    personalizedMessage += ' Remember, every cloud has a silver lining. Keep pushing.';
  }

  // Add more logic to personalize the message based on the user's mood and CRM data

  return personalizedMessage;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [personalizedMessage, setPersonalizedMessage] = useState<string>(message);
  const { mood, crmData } = useMindfulSales();

  useEffect(() => {
    if (mood && crmData) {
      const personalized = personalizeMessage(message, { mood, crmData });
      setPersonalizedMessage(personalized);
    }
  }, [mood, crmData]);

  const sanitizedMessage = sanitizeUserInput(personalizedMessage);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;