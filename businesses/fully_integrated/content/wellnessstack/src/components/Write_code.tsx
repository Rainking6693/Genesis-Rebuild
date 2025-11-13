import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allow for additional content within the component
}

const WellnessStackContentComponent: FC<Props> = ({ className, message, children, ...props }) => {
  // Remove any HTML tags to prevent XSS attacks
  const sanitizedMessage = message.replace(/<[^>]*>?/gm, '');

  // Add aria-label for accessibility
  const ariaLabel = sanitizedMessage || 'Wellness Stack Content';

  // Use a safe method for setting innerHTML to prevent XSS attacks
  const safeDangerouslySetInnerHTML = {
    __html: sanitizedMessage,
  };

  return (
    <div
      className={className}
      aria-label={ariaLabel} // Add aria-label for accessibility
      dangerouslySetInnerHTML={safeDangerouslySetInnerHTML}
      {...props}
    >
      {children} // Render any additional content within the component
    </div>
  );
};

export default WellnessStackContentComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode; // Allow for additional content within the component
}

const WellnessStackContentComponent: FC<Props> = ({ className, message, children, ...props }) => {
  // Remove any HTML tags to prevent XSS attacks
  const sanitizedMessage = message.replace(/<[^>]*>?/gm, '');

  // Add aria-label for accessibility
  const ariaLabel = sanitizedMessage || 'Wellness Stack Content';

  // Use a safe method for setting innerHTML to prevent XSS attacks
  const safeDangerouslySetInnerHTML = {
    __html: sanitizedMessage,
  };

  return (
    <div
      className={className}
      aria-label={ariaLabel} // Add aria-label for accessibility
      dangerouslySetInnerHTML={safeDangerouslySetInnerHTML}
      {...props}
    >
      {children} // Render any additional content within the component
    </div>
  );
};

export default WellnessStackContentComponent;