import React, { FunctionComponent, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { PropsWithChildren } from 'react';

interface MoodBoardProps extends PropsWithChildren<{ message: string }>, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Aria-label for accessibility
   */
  ariaLabel?: string;
}

const MoodBoardComponent: FunctionComponent<MoodBoardProps> = ({
  children,
  message,
  className,
  ariaLabel,
  ...rest
}) => {
  // Check if message is provided
  if (!message && !children) {
    throw new Error('Either message or children must be provided');
  }

  // Use children as fallback in case message is empty
  const finalMessage = children || message;

  return (
    <div className={`moodboard-message ${className}`} {...rest} aria-label={ariaLabel}>
      {finalMessage}
    </div>
  );
};

MoodBoardComponent.defaultProps = {
  children: '',
};

export default MoodBoardComponent;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { PropsWithChildren } from 'react';

interface MoodBoardProps extends PropsWithChildren<{ message: string }>, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Aria-label for accessibility
   */
  ariaLabel?: string;
}

const MoodBoardComponent: FunctionComponent<MoodBoardProps> = ({
  children,
  message,
  className,
  ariaLabel,
  ...rest
}) => {
  // Check if message is provided
  if (!message && !children) {
    throw new Error('Either message or children must be provided');
  }

  // Use children as fallback in case message is empty
  const finalMessage = children || message;

  return (
    <div className={`moodboard-message ${className}`} {...rest} aria-label={ariaLabel}>
      {finalMessage}
    </div>
  );
};

MoodBoardComponent.defaultProps = {
  children: '',
};

export default MoodBoardComponent;