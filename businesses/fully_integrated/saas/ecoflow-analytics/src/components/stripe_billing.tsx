import React, { ReactNode } from 'react';

interface StripeCardProps {
  title: string;
  content: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const StripeCard: React.FC<StripeCardProps> = ({
  title,
  content,
  className = 'stripe-card',
  'aria-label': ariaLabel,
}) => {
  // Validate props
  if (!title || typeof title !== 'string') {
    throw new Error('StripeCard: "title" prop must be a non-empty string');
  }

  if (!content) {
    throw new Error('StripeCard: "content" prop must be provided');
  }

  if (className && typeof className !== 'string') {
    throw new Error('StripeCard: "className" prop must be a string');
  }

  if (ariaLabel && typeof ariaLabel !== 'string') {
    throw new Error('StripeCard: "aria-label" prop must be a string');
  }

  return (
    <div
      className={`${className} stripe-card`}
      aria-label={ariaLabel || title}
      role="region"
      aria-live="polite"
    >
      <h2 className={`${className}__title`}>{title}</h2>
      <div className={`${className}__content`}>{content}</div>
    </div>
  );
};

export default StripeCard;

import React, { ReactNode } from 'react';

interface StripeCardProps {
  title: string;
  content: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const StripeCard: React.FC<StripeCardProps> = ({
  title,
  content,
  className = 'stripe-card',
  'aria-label': ariaLabel,
}) => {
  // Validate props
  if (!title || typeof title !== 'string') {
    throw new Error('StripeCard: "title" prop must be a non-empty string');
  }

  if (!content) {
    throw new Error('StripeCard: "content" prop must be provided');
  }

  if (className && typeof className !== 'string') {
    throw new Error('StripeCard: "className" prop must be a string');
  }

  if (ariaLabel && typeof ariaLabel !== 'string') {
    throw new Error('StripeCard: "aria-label" prop must be a string');
  }

  return (
    <div
      className={`${className} stripe-card`}
      aria-label={ariaLabel || title}
      role="region"
      aria-live="polite"
    >
      <h2 className={`${className}__title`}>{title}</h2>
      <div className={`${className}__content`}>{content}</div>
    </div>
  );
};

export default StripeCard;