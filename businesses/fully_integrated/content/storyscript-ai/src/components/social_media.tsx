import React, { FC, ReactNode, Key } from 'react';

type MessageId = string;
type Children = React.ReactNode;
type Message = string;

interface Props {
  message: Message;
  children?: Children;
  id?: MessageId;
}

const SocialMediaMessage: FC<Props> = ({ message, children, id }) => {
  // Use provided id if available, otherwise generate a unique identifier
  const uniqueId = id || generateUniqueId();

  // Check if message is not an empty string
  if (!message) return null;

  return (
    <div data-testid="social-media-message">
      {/* Add unique identifier for each message to aid in tracking and debugging */}
      <div data-message-id={uniqueId} role="presentation">
        {/* Allow for custom children, such as additional elements or accessibility attributes */}
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
        {message}
      </div>
    </div>
  );
};

// Utilize a UUID generator for unique identifiers
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Add a defaultProps object to set default values for optional props
SocialMediaMessage.defaultProps = {
  id: undefined,
  children: undefined,
};

export default SocialMediaMessage;

import React, { FC, ReactNode, Key } from 'react';

type MessageId = string;
type Children = React.ReactNode;
type Message = string;

interface Props {
  message: Message;
  children?: Children;
  id?: MessageId;
}

const SocialMediaMessage: FC<Props> = ({ message, children, id }) => {
  // Use provided id if available, otherwise generate a unique identifier
  const uniqueId = id || generateUniqueId();

  // Check if message is not an empty string
  if (!message) return null;

  return (
    <div data-testid="social-media-message">
      {/* Add unique identifier for each message to aid in tracking and debugging */}
      <div data-message-id={uniqueId} role="presentation">
        {/* Allow for custom children, such as additional elements or accessibility attributes */}
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
        {message}
      </div>
    </div>
  );
};

// Utilize a UUID generator for unique identifiers
function generateUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Add a defaultProps object to set default values for optional props
SocialMediaMessage.defaultProps = {
  id: undefined,
  children: undefined,
};

export default SocialMediaMessage;