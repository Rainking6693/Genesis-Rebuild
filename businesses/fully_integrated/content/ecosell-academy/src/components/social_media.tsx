import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const SocialMediaPost: FC<Props> = ({ message, className, testId, ...rest }) => {
  // Generate a unique key based on the message hash to improve performance
  const key = `social-media-post-${message?.split('').reduce((a, c) => a + c.charCodeAt(0), '')}` as keyof any;

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  return (
    <div {...rest} className={className} data-testid={testId} role="article">
      {/* Add a unique key for each post */}
      <div key={key} aria-label={`Social media post: ${message || ''}`}>
        {/* Render sanitized content */}
        {sanitizedMessage && <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
      </div>
    </div>
  );
};

export default SocialMediaPost;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message?: string;
}

const SocialMediaPost: FC<Props> = ({ message, className, testId, ...rest }) => {
  // Generate a unique key based on the message hash to improve performance
  const key = `social-media-post-${message?.split('').reduce((a, c) => a + c.charCodeAt(0), '')}` as keyof any;

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  return (
    <div {...rest} className={className} data-testid={testId} role="article">
      {/* Add a unique key for each post */}
      <div key={key} aria-label={`Social media post: ${message || ''}`}>
        {/* Render sanitized content */}
        {sanitizedMessage && <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />}
      </div>
    </div>
  );
};

export default SocialMediaPost;