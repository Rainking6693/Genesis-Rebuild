// MyReferralComponent.tsx
import React, { FC } from 'react';
import { sanitizeMessage } from './sanitize-message';
import { generateUniqueId } from './unique-id';

interface Props {
  message?: string;
}

const MyReferralComponent: FC<Props> = ({ message = 'Refer us' }) => {
  const uniqueId = generateUniqueId();
  const sanitizedMessage = sanitizeMessage(message);

  return (
    <a
      href={`https://ecometricspro.com/refer?id=${uniqueId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Referral link for ${sanitizedMessage}`}
      title={`Refer ${sanitizedMessage}`}
    >
      {sanitizedMessage}
    </a>
  );
};

export default MyReferralComponent;

// sanitize-message.ts
import sanitize from 'sanitize-html';

if (!sanitize) {
  throw new Error('sanitize-html package is not installed');
}

export const sanitizeMessage = (message: string) => {
  return sanitize(message, { allowedTags: [], allowedAttributes: {} });
};

// unique-id.ts
import { v4 as uuidv4 } from 'uuid';

if (!uuidv4) {
  const dateNow = Date.now();
  export const generateUniqueId = () => `gen-${dateNow}`;
} else {
  export const generateUniqueId = () => uuidv4();
}

// MyReferralComponent.tsx
import React, { FC } from 'react';
import { sanitizeMessage } from './sanitize-message';
import { generateUniqueId } from './unique-id';

interface Props {
  message?: string;
}

const MyReferralComponent: FC<Props> = ({ message = 'Refer us' }) => {
  const uniqueId = generateUniqueId();
  const sanitizedMessage = sanitizeMessage(message);

  return (
    <a
      href={`https://ecometricspro.com/refer?id=${uniqueId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Referral link for ${sanitizedMessage}`}
      title={`Refer ${sanitizedMessage}`}
    >
      {sanitizedMessage}
    </a>
  );
};

export default MyReferralComponent;

// sanitize-message.ts
import sanitize from 'sanitize-html';

if (!sanitize) {
  throw new Error('sanitize-html package is not installed');
}

export const sanitizeMessage = (message: string) => {
  return sanitize(message, { allowedTags: [], allowedAttributes: {} });
};

// unique-id.ts
import { v4 as uuidv4 } from 'uuid';

if (!uuidv4) {
  const dateNow = Date.now();
  export const generateUniqueId = () => `gen-${dateNow}`;
} else {
  export const generateUniqueId = () => uuidv4();
}