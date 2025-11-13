import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message: string;
  /** Additional class names for custom styling */
  className?: string;
};

const CreatorCRMMessage: FunctionComponent<Props> = ({ className, message, ...rest }) => {
  // Add a role attribute for accessibility
  const rootProps = {
    ...rest,
    role: 'alert', // Use a semantic role for screen readers
    className: `creator-crm-message ${className || ''}`,
  };

  // Handle empty message case
  if (!message) return null;

  return <div {...rootProps}>{message}</div>;
};

export default CreatorCRMMessage;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message: string;
  /** Additional class names for custom styling */
  className?: string;
};

const CreatorCRMMessage: FunctionComponent<Props> = ({ className, message, ...rest }) => {
  // Add a role attribute for accessibility
  const rootProps = {
    ...rest,
    role: 'alert', // Use a semantic role for screen readers
    className: `creator-crm-message ${className || ''}`,
  };

  // Handle empty message case
  if (!message) return null;

  return <div {...rootProps}>{message}</div>;
};

export default CreatorCRMMessage;