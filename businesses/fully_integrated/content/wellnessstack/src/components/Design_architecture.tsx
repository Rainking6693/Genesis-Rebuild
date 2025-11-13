import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type WellnessMessage = {
  id: string; // Unique identifier for each message to handle multiple messages
  message: string; // The actual wellness message
  altText?: string; // Alternative text for accessibility
};

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  wellnessMessage: WellnessMessage; // Use a more descriptive type that aligns with the business context
};

const MyWellnessComponent: FC<Props> = ({ wellnessMessage, ...divProps }) => {
  const { id, message, altText } = wellnessMessage;

  // Add a data attribute for ARIA accessibility
  const dataAriaLabel = altText || message;

  // Handle edge cases where id is not provided
  const defaultId = 'wellness-message';
  const finalId = id || defaultId;

  return (
    <div {...divProps} data-testid={finalId} data-aria-label={dataAriaLabel} role="presentation">
      {message}
    </div>
  );
};

export default MyWellnessComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type WellnessMessage = {
  id: string; // Unique identifier for each message to handle multiple messages
  message: string; // The actual wellness message
  altText?: string; // Alternative text for accessibility
};

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  wellnessMessage: WellnessMessage; // Use a more descriptive type that aligns with the business context
};

const MyWellnessComponent: FC<Props> = ({ wellnessMessage, ...divProps }) => {
  const { id, message, altText } = wellnessMessage;

  // Add a data attribute for ARIA accessibility
  const dataAriaLabel = altText || message;

  // Handle edge cases where id is not provided
  const defaultId = 'wellness-message';
  const finalId = id || defaultId;

  return (
    <div {...divProps} data-testid={finalId} data-aria-label={dataAriaLabel} role="presentation">
      {message}
    </div>
  );
};

export default MyWellnessComponent;