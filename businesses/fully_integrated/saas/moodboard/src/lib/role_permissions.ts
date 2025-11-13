import React, { FC, ReactNode } from 'react';

// Abstract base component for better maintainability
interface BaseComponentProps {
  children?: ReactNode;
  className?: string; // Adding a class name for styling and accessibility
}

const BaseComponent: FC<BaseComponentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// MoodBoardComponent
interface MoodBoardComponentProps extends BaseComponentProps {
  message: string;
}

const MoodBoardComponent: FC<MoodBoardComponentProps> = ({ message, ...props }) => {
  // Adding a default message for edge cases where props.message is undefined or null
  const displayedMessage = message || 'No message provided';

  return <BaseComponent {...props} aria-label={`Mood Board: ${displayedMessage}`}>{displayedMessage}</BaseComponent>;
};

// SecondComponent
interface SecondComponentProps extends BaseComponentProps {
  message: string;
}

const SecondComponent: FC<SecondComponentProps> = ({ message, ...props }) => {
  // Adding a default message for edge cases where props.message is undefined or null
  const displayedMessage = message || 'No message provided';

  return <BaseComponent {...props} aria-label={`Second Component: ${displayedMessage}`}>{displayedMessage}</BaseComponent>;
};

export { MoodBoardComponent, SecondComponent };

import React, { FC, ReactNode } from 'react';

// Abstract base component for better maintainability
interface BaseComponentProps {
  children?: ReactNode;
  className?: string; // Adding a class name for styling and accessibility
}

const BaseComponent: FC<BaseComponentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// MoodBoardComponent
interface MoodBoardComponentProps extends BaseComponentProps {
  message: string;
}

const MoodBoardComponent: FC<MoodBoardComponentProps> = ({ message, ...props }) => {
  // Adding a default message for edge cases where props.message is undefined or null
  const displayedMessage = message || 'No message provided';

  return <BaseComponent {...props} aria-label={`Mood Board: ${displayedMessage}`}>{displayedMessage}</BaseComponent>;
};

// SecondComponent
interface SecondComponentProps extends BaseComponentProps {
  message: string;
}

const SecondComponent: FC<SecondComponentProps> = ({ message, ...props }) => {
  // Adding a default message for edge cases where props.message is undefined or null
  const displayedMessage = message || 'No message provided';

  return <BaseComponent {...props} aria-label={`Second Component: ${displayedMessage}`}>{displayedMessage}</BaseComponent>;
};

export { MoodBoardComponent, SecondComponent };