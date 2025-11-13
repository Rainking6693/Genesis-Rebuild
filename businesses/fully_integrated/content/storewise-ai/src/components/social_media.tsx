import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import { classNames } from './utilities';

interface Props {
  message: string;
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const SocialMediaPost: FC<Props> = ({ message, children, className, isLoading }) => {
  const combinedClassName = classNames('social-media-post', className);

  if (isLoading) {
    return <div className={combinedClassName} aria-label="Loading social media post" role="region">Loading...</div>;
  }

  return (
    <div className={combinedClassName} aria-label="Social media post" role="region">
      {message && <span>{message}</span>}
      {children.map((child: ReactNode, index: Key) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
};

SocialMediaPost.defaultProps = {
  message: 'Default social media post message',
};

SocialMediaPost.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedSocialMediaPost = React.memo(SocialMediaPost);

export default MemoizedSocialMediaPost;

// Utilities for handling class names
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import { classNames } from './utilities';

interface Props {
  message: string;
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const SocialMediaPost: FC<Props> = ({ message, children, className, isLoading }) => {
  const combinedClassName = classNames('social-media-post', className);

  if (isLoading) {
    return <div className={combinedClassName} aria-label="Loading social media post" role="region">Loading...</div>;
  }

  return (
    <div className={combinedClassName} aria-label="Social media post" role="region">
      {message && <span>{message}</span>}
      {children.map((child: ReactNode, index: Key) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
};

SocialMediaPost.defaultProps = {
  message: 'Default social media post message',
};

SocialMediaPost.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedSocialMediaPost = React.memo(SocialMediaPost);

export default MemoizedSocialMediaPost;

// Utilities for handling class names
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');