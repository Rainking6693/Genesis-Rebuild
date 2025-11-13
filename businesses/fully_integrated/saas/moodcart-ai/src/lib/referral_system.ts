import React, { FC, useCallback, useEffect, useState } from 'react';

interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [id, setId] = useState(generateUniqueId());
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.select();
    document.execCommand('copy');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  useEffect(() => {
    const newId = generateUniqueId();
    if (newId !== id) {
      setId(newId);
    }
  }, []);

  return (
    <div>
      {/* Add a unique identifier for each referral link to track referrals */}
      <a href={`https://www.moodcartai.com/refer?ref=${id}`} target="_blank" rel="noopener noreferrer">
        {message}
      </a>
      <button onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : 'Copy Referral Link'}
      </button>
    </div>
  );
};

// Implement a custom hook to generate unique referral IDs
const useUniqueId = () => {
  const [id, setId] = useState(generateUniqueId());

  const generateNewId = useCallback(() => {
    setId(generateUniqueId());
  }, []);

  return { id, generateNewId };
};

// Generate a unique ID using a combination of time and randomness to minimize the chance of collisions
const generateUniqueId = () => new Date().getTime() + Math.floor(Math.random() * 10000);

export { ReferralMessage, useUniqueId };

import React, { FC, useCallback, useEffect, useState } from 'react';

interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [id, setId] = useState(generateUniqueId());
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.select();
    document.execCommand('copy');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  useEffect(() => {
    const newId = generateUniqueId();
    if (newId !== id) {
      setId(newId);
    }
  }, []);

  return (
    <div>
      {/* Add a unique identifier for each referral link to track referrals */}
      <a href={`https://www.moodcartai.com/refer?ref=${id}`} target="_blank" rel="noopener noreferrer">
        {message}
      </a>
      <button onClick={handleCopyClick}>
        {isCopied ? 'Copied!' : 'Copy Referral Link'}
      </button>
    </div>
  );
};

// Implement a custom hook to generate unique referral IDs
const useUniqueId = () => {
  const [id, setId] = useState(generateUniqueId());

  const generateNewId = useCallback(() => {
    setId(generateUniqueId());
  }, []);

  return { id, generateNewId };
};

// Generate a unique ID using a combination of time and randomness to minimize the chance of collisions
const generateUniqueId = () => new Date().getTime() + Math.floor(Math.random() * 10000);

export { ReferralMessage, useUniqueId };