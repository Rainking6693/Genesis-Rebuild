import React, { FC, ReactNode, Key } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

type Props = {
  message: string;
  className?: string;
  id?: string; // Added id prop for better accessibility and maintainability
};

const ReferralSystemMessage: FC<Props> = ({ message, className, id }) => {
  const uniqueId = id || generateUniqueId();

  return (
    <div>
      <span
        data-message-id={uniqueId} // Updated aria-label to use data-* attribute for better accessibility
        aria-labelledby={`referral-system-message-${uniqueId}`} // Added aria-labelledby for better accessibility
        key={uniqueId}
        id={`referral-system-message-${uniqueId}`} // Added id for better accessibility and maintainability
        className={className}
      >
        {message}
      </span>
    </div>
  );
};

function generateUniqueId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return uuidv4();
}

export default ReferralSystemMessage;

import React, { FC, ReactNode, Key } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

type Props = {
  message: string;
  className?: string;
  id?: string; // Added id prop for better accessibility and maintainability
};

const ReferralSystemMessage: FC<Props> = ({ message, className, id }) => {
  const uniqueId = id || generateUniqueId();

  return (
    <div>
      <span
        data-message-id={uniqueId} // Updated aria-label to use data-* attribute for better accessibility
        aria-labelledby={`referral-system-message-${uniqueId}`} // Added aria-labelledby for better accessibility
        key={uniqueId}
        id={`referral-system-message-${uniqueId}`} // Added id for better accessibility and maintainability
        className={className}
      >
        {message}
      </span>
    </div>
  );
};

function generateUniqueId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return uuidv4();
}

export default ReferralSystemMessage;