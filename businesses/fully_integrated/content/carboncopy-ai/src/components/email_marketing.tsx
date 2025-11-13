import React, { FC, PropsWithChildren, DefaultHTMLProps, HTMLAttributes } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

// Adding a defaultProps for accessibility and maintainability
const defaultProps: Props = {
  message: 'Welcome to CarbonCopy AI! Discover how we can help your business become a sustainable brand today.',
  role: 'presentation', // Adding a role attribute for accessibility
};

// Extending Props with defaultProps for type safety
type ComponentProps = PropsWithChildren<Props & typeof defaultProps>;

// Function to validate the message and handle edge cases
const validateMessage = (message: string) => {
  // Implement validation logic to ensure message is safe for HTML injection
  // For simplicity, I've used a regular expression to remove any potentially dangerous HTML tags
  const sanitizedMessage = message.replace(/<[^>]+>/gm, '');

  if (!sanitizedMessage.trim()) {
    throw new Error('Message cannot be empty');
  }

  return sanitizedMessage;
};

const MyEmailComponent: FC<ComponentProps> = ({ message, ...rest }) => {
  // Using the validated message to avoid potential security issues
  const safeMessage = validateMessage(message);

  return <div dangerouslySetInnerHTML={{ __html: safeMessage }} {...rest} />;
};

MyEmailComponent.defaultProps = defaultProps;

export default MyEmailComponent;

import React, { FC, PropsWithChildren, DefaultHTMLProps, HTMLAttributes } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

// Adding a defaultProps for accessibility and maintainability
const defaultProps: Props = {
  message: 'Welcome to CarbonCopy AI! Discover how we can help your business become a sustainable brand today.',
  role: 'presentation', // Adding a role attribute for accessibility
};

// Extending Props with defaultProps for type safety
type ComponentProps = PropsWithChildren<Props & typeof defaultProps>;

// Function to validate the message and handle edge cases
const validateMessage = (message: string) => {
  // Implement validation logic to ensure message is safe for HTML injection
  // For simplicity, I've used a regular expression to remove any potentially dangerous HTML tags
  const sanitizedMessage = message.replace(/<[^>]+>/gm, '');

  if (!sanitizedMessage.trim()) {
    throw new Error('Message cannot be empty');
  }

  return sanitizedMessage;
};

const MyEmailComponent: FC<ComponentProps> = ({ message, ...rest }) => {
  // Using the validated message to avoid potential security issues
  const safeMessage = validateMessage(message);

  return <div dangerouslySetInnerHTML={{ __html: safeMessage }} {...rest} />;
};

MyEmailComponent.defaultProps = defaultProps;

export default MyEmailComponent;