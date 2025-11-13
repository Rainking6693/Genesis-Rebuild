import React, { memo, useMemo, useCallback } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event
  }, []);

  return (
    <div aria-label="Email Marketing" role="region">
      <h1
        data-testid="email-marketing-title"
        contentEditable
        onBlur={handleTitleChange}
        suppressContentEditableWarning
      >
        {safeTitle}
      </h1>
      <p
        data-testid="email-marketing-content"
        contentEditable
        onBlur={handleContentChange}
        suppressContentEditableWarning
      >
        {safeContent}
      </p>
    </div>
  );
});

export default EmailMarketing;

import React, { memo, useMemo, useCallback } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLHeadingElement>) => {
    // Handle title change event
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLParagraphElement>) => {
    // Handle content change event
  }, []);

  return (
    <div aria-label="Email Marketing" role="region">
      <h1
        data-testid="email-marketing-title"
        contentEditable
        onBlur={handleTitleChange}
        suppressContentEditableWarning
      >
        {safeTitle}
      </h1>
      <p
        data-testid="email-marketing-content"
        contentEditable
        onBlur={handleContentChange}
        suppressContentEditableWarning
      >
        {safeContent}
      </p>
    </div>
  );
});

export default EmailMarketing;