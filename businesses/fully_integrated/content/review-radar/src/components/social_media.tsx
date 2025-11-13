import React, { FC, Key, ReactNode } from 'react';
import { sanitizeUserInput } from 'security-utils';

interface Props {
  message: string;
  children?: ReactNode;
  avatarUrl?: string;
  username?: string;
}

const SocialMediaFeed: FC<Props> = ({ message, children, avatarUrl, username }) => {
  // Add a key prop for React performance optimization
  const key = message || (children && children.key);

  // Sanitize user input before rendering
  const sanitizedMessage = sanitizeUserInput(message);

  // Add support for avatarUrl and username
  const avatarElement = avatarUrl ? <img src={avatarUrl} alt="Avatar" className="avatar" /> : null;
  const usernameElement = username ? <span className="username">{username}</span> : null;

  // Add accessibility by wrapping the content in a div with aria-label
  return (
    <div key={key} className="review-radar-social-media" aria-label="Social media feed item">
      {avatarElement}
      {usernameElement}
      {sanitizedMessage}
      {children}
    </div>
  );
};

export default SocialMediaFeed;

import React, { FC, Key, ReactNode } from 'react';
import { sanitizeUserInput } from 'security-utils';

interface Props {
  message: string;
  children?: ReactNode;
  avatarUrl?: string;
  username?: string;
}

const SocialMediaFeed: FC<Props> = ({ message, children, avatarUrl, username }) => {
  // Add a key prop for React performance optimization
  const key = message || (children && children.key);

  // Sanitize user input before rendering
  const sanitizedMessage = sanitizeUserInput(message);

  // Add support for avatarUrl and username
  const avatarElement = avatarUrl ? <img src={avatarUrl} alt="Avatar" className="avatar" /> : null;
  const usernameElement = username ? <span className="username">{username}</span> : null;

  // Add accessibility by wrapping the content in a div with aria-label
  return (
    <div key={key} className="review-radar-social-media" aria-label="Social media feed item">
      {avatarElement}
      {usernameElement}
      {sanitizedMessage}
      {children}
    </div>
  );
};

export default SocialMediaFeed;