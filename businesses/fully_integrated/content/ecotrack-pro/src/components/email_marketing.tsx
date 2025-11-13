import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  className?: string; // Adding a class name for styling and maintainability
  ariaLabel?: string; // Adding an aria-label for accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, className, ariaLabel }) => {
  return (
    <div role="presentation" className={className} aria-label={ariaLabel} style={{ margin: 0, padding: 0 }}> // Adding role="presentation" to prevent screen readers from interpreting the email as a list or table, and className for styling
      <div style={{ padding: '1rem' }}>
        <h2>{subject}</h2>
        <div>{message}</div>
        {children} // Rendering any additional content provided
      </div>
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject: string;
  message: string;
  children?: ReactNode; // Allows for additional content within the email component
  className?: string; // Adding a class name for styling and maintainability
  ariaLabel?: string; // Adding an aria-label for accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, children, className, ariaLabel }) => {
  return (
    <div role="presentation" className={className} aria-label={ariaLabel} style={{ margin: 0, padding: 0 }}> // Adding role="presentation" to prevent screen readers from interpreting the email as a list or table, and className for styling
      <div style={{ padding: '1rem' }}>
        <h2>{subject}</h2>
        <div>{message}</div>
        {children} // Rendering any additional content provided
      </div>
    </div>
  );
};

export default MyEmailComponent;