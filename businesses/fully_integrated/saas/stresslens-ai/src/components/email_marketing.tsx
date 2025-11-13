import React, { memo, useMemo } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div role="region" aria-label="Email Marketing" data-testid="email-marketing">
      <h1 data-testid="email-marketing-title">{safeTitle}</h1>
      <p data-testid="email-marketing-content">{safeContent}</p>
    </div>
  );
});

export default EmailMarketing;

import React, { memo, useMemo } from 'react';

interface EmailMarketingProps {
  title?: string;
  content?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Default Title', [title]);
  const safeContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div role="region" aria-label="Email Marketing" data-testid="email-marketing">
      <h1 data-testid="email-marketing-title">{safeTitle}</h1>
      <p data-testid="email-marketing-content">{safeContent}</p>
    </div>
  );
});

export default EmailMarketing;