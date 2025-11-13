// Import necessary modules
import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Custom hook to generate unique IDs
export const useUniqueId = () => {
  const [id, setId] = useState(uuidv4());

  // Generate a new unique ID on each component mount
  const resetId = () => setId(uuidv4());

  return [id, resetId];
};

// ReferralMessage component
interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// MyComponent component
interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// Import React Router Navigate for navigating back to the previous page
import { useNavigate } from 'react-router-dom';

// Import the necessary components
import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Custom hook to generate unique IDs
export const useUniqueId = () => {
  const [id, setId] = useState(uuidv4());

  // Generate a new unique ID on each component mount
  const resetId = () => setId(uuidv4());

  return [id, resetId];
};

// ReferralMessage component
interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// MyComponent component
interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

export default MyComponent;

// Import necessary modules
import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Custom hook to generate unique IDs
export const useUniqueId = () => {
  const [id, setId] = useState(uuidv4());

  // Generate a new unique ID on each component mount
  const resetId = () => setId(uuidv4());

  return [id, resetId];
};

// ReferralMessage component
interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// MyComponent component
interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// Import React Router Navigate for navigating back to the previous page
import { useNavigate } from 'react-router-dom';

// Import the necessary components
import React, { FC, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Custom hook to generate unique IDs
export const useUniqueId = () => {
  const [id, setId] = useState(uuidv4());

  // Generate a new unique ID on each component mount
  const resetId = () => setId(uuidv4());

  return [id, resetId];
};

// ReferralMessage component
interface Props {
  message: string;
}

const ReferralMessage: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

// MyComponent component
interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [uniqueId, resetId] = useUniqueId();
  const navigate = useNavigate();

  // Reset the unique ID on each render to ensure it's unique for each transaction
  useEffect(() => {
    resetId();
    // Navigate back to the previous page after generating a new unique ID
    navigate(-1);
  }, []);

  return (
    <div>
      {/* Use the unique ID in the referral link */}
      <a
        href={`https://www.carboncommit.com/refer?ref=${uniqueId}`}
        rel="noopener noreferrer"
        target="_blank"
        aria-label={`Referral link for ${message}`}
      >
        {message}
      </a>
    </div>
  );
};

export default MyComponent;