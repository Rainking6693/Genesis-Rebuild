import React, { memo, useMemo, useState, useEffect } from 'react';

interface SupportComponentProps {
  title: string;
  content: string;
}

const SupportComponent: React.FC<SupportComponentProps> = memo(({ title, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>('');

  // Sanitize the content to prevent XSS attacks
  useEffect(() => {
    const sanitize = (input: string): string => {
      return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    try {
      setSanitizedContent(<p className="support-content">{sanitize(content)}</p>);
    } catch (error) {
      console.error('Error sanitizing content:', error);
      setSanitizedContent(
        <p className="support-content">
          Oops, something went wrong while rendering the content. Please try again later.
        </p>
      );
    }
  }, [content]);

  return (
    <div className="support-component" aria-label={title}>
      <h1 className="support-title" id="support-title">
        {title}
      </h1>
      {sanitizedContent}
    </div>
  );
});

export default SupportComponent;

import React, { memo, useMemo, useState, useEffect } from 'react';

interface SupportComponentProps {
  title: string;
  content: string;
}

const SupportComponent: React.FC<SupportComponentProps> = memo(({ title, content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<React.ReactNode>('');

  // Sanitize the content to prevent XSS attacks
  useEffect(() => {
    const sanitize = (input: string): string => {
      return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    try {
      setSanitizedContent(<p className="support-content">{sanitize(content)}</p>);
    } catch (error) {
      console.error('Error sanitizing content:', error);
      setSanitizedContent(
        <p className="support-content">
          Oops, something went wrong while rendering the content. Please try again later.
        </p>
      );
    }
  }, [content]);

  return (
    <div className="support-component" aria-label={title}>
      <h1 className="support-title" id="support-title">
        {title}
      </h1>
      {sanitizedContent}
    </div>
  );
});

export default SupportComponent;