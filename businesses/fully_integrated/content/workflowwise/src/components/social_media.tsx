import React, { FC, UseId, useId } from 'react';
import { useXSS, XSSOptions } from 'xss';

interface Props {
  message: string;
}

type UseId = () => string;

const SocialMediaComponent: FC<Props> = ({ message }) => {
  const id: UseId = useId;
  const sanitize: XSSOptions = useXSS();

  // Sanitize user-generated content before rendering
  const sanitizedMessage = sanitize(message);

  // Check if message is empty before rendering
  if (!sanitizedMessage) return null;

  return (
    <div data-testid="social-media-component">
      {/* Add unique ID for accessibility and tracking purposes */}
      <div id={id()} role="alert" aria-labelledby={`social-media-message-${id()}`}>
        {sanitizedMessage}
      </div>

      {/* Add an ARIA-labelledby attribute for screen readers */}
      <h2 id={`social-media-message-${id()}`} aria-describedby={id()}>
        {sanitizedMessage}
      </h2>

      {/* Add a title attribute for better accessibility */}
      <h2 id={`social-media-message-${id()}`} title={sanitizedMessage}>
        {sanitizedMessage}
      </h2>
    </div>
  );
};

export default SocialMediaComponent;

This updated code addresses the requested improvements and follows best practices for resiliency, edge cases, accessibility, and maintainability.