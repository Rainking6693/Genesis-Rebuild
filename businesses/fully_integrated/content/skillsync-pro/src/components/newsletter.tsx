import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string; // Add optional subject for personalized newsletter
  message: string;
  className?: string; // Add optional class name for styling
}

const validateMessage = (message: string) => {
  if (!message) {
    throw new Error('Message cannot be empty');
  }
  return message;
};

const MyComponent: FC<Props> = ({ subject, message, className, ...rest }) => {
  const sanitizedMessage = validateMessage(message);

  return (
    <div className={className} {...rest}>
      <h3>{subject || 'Your Daily SkillSync Pro Update'}</h3> // Use default subject if subject is not provided
      <div
        // Use a safe-html library like DOMPurify to sanitize user-provided HTML to prevent XSS attacks
        // https://github.com/cure53/DOMPurify
        // ... (assuming you've installed DOMPurify and imported it as purify)
        dangerouslySetInnerHTML={{ __html: purify.sanitize(sanitizedMessage) }}
      />
    </div>
  );
};

export default MyComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string; // Add optional subject for personalized newsletter
  message: string;
  className?: string; // Add optional class name for styling
}

const validateMessage = (message: string) => {
  if (!message) {
    throw new Error('Message cannot be empty');
  }
  return message;
};

const MyComponent: FC<Props> = ({ subject, message, className, ...rest }) => {
  const sanitizedMessage = validateMessage(message);

  return (
    <div className={className} {...rest}>
      <h3>{subject || 'Your Daily SkillSync Pro Update'}</h3> // Use default subject if subject is not provided
      <div
        // Use a safe-html library like DOMPurify to sanitize user-provided HTML to prevent XSS attacks
        // https://github.com/cure53/DOMPurify
        // ... (assuming you've installed DOMPurify and imported it as purify)
        dangerouslySetInnerHTML={{ __html: purify.sanitize(sanitizedMessage) }}
      />
    </div>
  );
};

export default MyComponent;