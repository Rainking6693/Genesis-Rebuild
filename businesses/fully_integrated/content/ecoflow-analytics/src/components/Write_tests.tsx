import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface SustainabilityMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed
   */
  message: string;

  /**
   * The unique id for the sustainability message
   */
  id?: string;

  /**
   * Additional classes to be applied to the sustainability message
   */
  className?: string;

  /**
   * The id of the element that labels this element (for accessibility)
   */
  ariaLabelledby?: string;

  /**
   * The role of the sustainability message (for accessibility)
   */
  role?: string;
}

/**
 * SustainabilityMessage functional component
 * Renders a sustainability-related message
 */
const SustainabilityMessage: FC<SustainabilityMessageProps> = ({
  message,
  id,
  className,
  ariaLabelledby,
  role,
  ...props
}) => {
  // Check if id is provided
  if (!id) {
    id = SustainabilityMessage.defaultProps.id;
  }

  // Check if message is provided
  if (!message) {
    throw new Error('The "message" prop is required.');
  }

  return (
    <div id={id} className={className} aria-labelledby={ariaLabelledby} role={role} {...props}>
      <p>{message}</p>
    </div>
  );
};

SustainabilityMessage.defaultProps = {
  id: 'sustainability-message',
};

export default SustainabilityMessage;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface SustainabilityMessageProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * The message to be displayed
   */
  message: string;

  /**
   * The unique id for the sustainability message
   */
  id?: string;

  /**
   * Additional classes to be applied to the sustainability message
   */
  className?: string;

  /**
   * The id of the element that labels this element (for accessibility)
   */
  ariaLabelledby?: string;

  /**
   * The role of the sustainability message (for accessibility)
   */
  role?: string;
}

/**
 * SustainabilityMessage functional component
 * Renders a sustainability-related message
 */
const SustainabilityMessage: FC<SustainabilityMessageProps> = ({
  message,
  id,
  className,
  ariaLabelledby,
  role,
  ...props
}) => {
  // Check if id is provided
  if (!id) {
    id = SustainabilityMessage.defaultProps.id;
  }

  // Check if message is provided
  if (!message) {
    throw new Error('The "message" prop is required.');
  }

  return (
    <div id={id} className={className} aria-labelledby={ariaLabelledby} role={role} {...props}>
      <p>{message}</p>
    </div>
  );
};

SustainabilityMessage.defaultProps = {
  id: 'sustainability-message',
};

export default SustainabilityMessage;