import React, { memo, useMemo } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title,
  content,
  headingLevel = 'h2',
}) => {
  // Resiliency: Handle edge cases where title or content is not provided
  const safeTitle = useMemo(() => title || 'Email Marketing', [title]);
  const safeContent = useMemo(() => content || 'No content provided.', [content]);

  // Accessibility: Use appropriate heading level based on the component's usage
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  return (
    <div>
      <HeadingTag>{safeTitle}</HeadingTag>
      <p>{safeContent}</p>
    </div>
  );
};

// Maintainability: Wrap the component in a memo to prevent unnecessary re-renders
export default memo(EmailMarketing);

import React, { memo, useMemo } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  title,
  content,
  headingLevel = 'h2',
}) => {
  // Resiliency: Handle edge cases where title or content is not provided
  const safeTitle = useMemo(() => title || 'Email Marketing', [title]);
  const safeContent = useMemo(() => content || 'No content provided.', [content]);

  // Accessibility: Use appropriate heading level based on the component's usage
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  return (
    <div>
      <HeadingTag>{safeTitle}</HeadingTag>
      <p>{safeContent}</p>
    </div>
  );
};

// Maintainability: Wrap the component in a memo to prevent unnecessary re-renders
export default memo(EmailMarketing);