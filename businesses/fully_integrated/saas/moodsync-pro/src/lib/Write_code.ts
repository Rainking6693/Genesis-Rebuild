import React, { FC, Key, React.ReactNode } from 'react';

interface Props {
  children?: React.ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }: Props) => {
  // Check if children or message is provided
  if (!children && !message) {
    return null;
  }

  // Use message if children is not provided, otherwise use children
  const content = children ? children : message;

  // Add role, aria-label, and aria-labelledby for accessibility
  const ariaLabelledBy = content ? undefined : 'message-container';

  return (
    <div
      className="message-container"
      role="alert"
      aria-label="Message"
      aria-labelledby={ariaLabelledBy}
    >
      {content}
      {/* Use a unique key for each rendered element for better performance */}
      {Array.isArray(content) ? content.map((item: React.ReactNode, index: Key) => (
        <div key={index}>{item}</div>
      )) : <div key={content}>{content}</div>}
    </div>
  );
};

// Add error handling for missing props
MyComponent.defaultProps = {
  children: undefined,
  message: 'No message provided',
};

// Use a consistent naming convention for imports and components
// and add displayName for easier debugging
import { FC } from 'react';

export const MyComponent = MyComponent as FC<Props>;