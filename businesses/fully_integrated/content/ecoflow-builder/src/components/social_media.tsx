import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  message: string;
  linkText?: string;
  linkHref?: string;
}

const SocialMediaPost: FC<Props> = ({ message, linkText = 'Learn more', linkHref = '#' }) => {
  // Add a default value for linkHref to prevent errors when it's not provided
  const defaultLinkHref = '#';
  const href = linkHref || defaultLinkHref;

  // Use PropsWithChildren to allow for additional content within the post
  const children = props.children as ReactNode;

  return (
    <div className="social-media-post">
      {/* Add appropriate HTML tags for formatting and accessibility */}
      <h3 className="sr-only">Share our sustainability efforts</h3>
      <h3 className="screen-reader-text">Share our sustainability efforts</h3>
      <p>{message}</p>
      {/* Include a link to the full report or more information */}
      <a href={href} target="_blank" rel="noopener noreferrer">{linkText}</a>
      {/* Allow for additional content within the post */}
      {children}
    </div>
  );
};

export default SocialMediaPost;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface Props {
  message: string;
  linkText?: string;
  linkHref?: string;
}

const SocialMediaPost: FC<Props> = ({ message, linkText = 'Learn more', linkHref = '#' }) => {
  // Add a default value for linkHref to prevent errors when it's not provided
  const defaultLinkHref = '#';
  const href = linkHref || defaultLinkHref;

  // Use PropsWithChildren to allow for additional content within the post
  const children = props.children as ReactNode;

  return (
    <div className="social-media-post">
      {/* Add appropriate HTML tags for formatting and accessibility */}
      <h3 className="sr-only">Share our sustainability efforts</h3>
      <h3 className="screen-reader-text">Share our sustainability efforts</h3>
      <p>{message}</p>
      {/* Include a link to the full report or more information */}
      <a href={href} target="_blank" rel="noopener noreferrer">{linkText}</a>
      {/* Allow for additional content within the post */}
      {children}
    </div>
  );
};

export default SocialMediaPost;