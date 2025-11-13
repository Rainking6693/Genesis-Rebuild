import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

interface Props {
  message: string;
}

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState(generateUniqueIdentifier());

  useEffect(() => {
    setUniqueIdentifier(generateUniqueIdentifier());
  }, []);

  // Check if the URL is valid before navigating
  const isValidURL = (url: string) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  // Handle edge cases where the unique identifier is not a valid URL
  const handleUniqueIdentifier = (uniqueIdentifier: string) => {
    if (!isValidURL(`https://greenshiftanalytics.com/refer?ref=${uniqueIdentifier}`)) {
      setUniqueIdentifier(generateUniqueIdentifier());
    }
  };

  useEffect(() => {
    handleUniqueIdentifier(uniqueIdentifier);
  }, [uniqueIdentifier]);

  return (
    <div>
      <a
        href={`https://greenshiftanalytics.com/refer?ref=${uniqueIdentifier}`}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => handleUniqueIdentifier(uniqueIdentifier)}
      >
        {message}
      </a>
    </div>
  );
};

const generateUniqueIdentifier = () => {
  return crypto.createHash('sha256').update(Date.now().toString()).digest('hex');
};

export default ReferralSystemMessage;

import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

interface Props {
  message: string;
}

const ReferralSystemMessage: FC<Props> = ({ message }) => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState(generateUniqueIdentifier());

  useEffect(() => {
    setUniqueIdentifier(generateUniqueIdentifier());
  }, []);

  // Check if the URL is valid before navigating
  const isValidURL = (url: string) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  // Handle edge cases where the unique identifier is not a valid URL
  const handleUniqueIdentifier = (uniqueIdentifier: string) => {
    if (!isValidURL(`https://greenshiftanalytics.com/refer?ref=${uniqueIdentifier}`)) {
      setUniqueIdentifier(generateUniqueIdentifier());
    }
  };

  useEffect(() => {
    handleUniqueIdentifier(uniqueIdentifier);
  }, [uniqueIdentifier]);

  return (
    <div>
      <a
        href={`https://greenshiftanalytics.com/refer?ref=${uniqueIdentifier}`}
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => handleUniqueIdentifier(uniqueIdentifier)}
      >
        {message}
      </a>
    </div>
  );
};

const generateUniqueIdentifier = () => {
  return crypto.createHash('sha256').update(Date.now().toString()).digest('hex');
};

export default ReferralSystemMessage;