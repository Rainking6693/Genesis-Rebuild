import React, { memo, useMemo } from 'react';

interface SustainabilityContentProps {
  title?: string;
  content?: string;
}

const SustainabilityContent: React.FC<SustainabilityContentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => (typeof title === 'string' ? title.trim() : ''), [title]);
  const sanitizedContent = useMemo(() => (typeof content === 'string' ? content.trim() : ''), [
    content,
  ]);

  return (
    <div
      className="sustainability-content"
      aria-label="Sustainability Content"
      role="region"
      data-testid="sustainability-content"
    >
      {sanitizedTitle && (
        <h1
          className="sustainability-title"
          aria-label="Sustainability Title"
          data-testid="sustainability-title"
        >
          {sanitizedTitle}
        </h1>
      )}
      {sanitizedContent && (
        <p
          className="sustainability-description"
          aria-label="Sustainability Description"
          data-testid="sustainability-description"
        >
          {sanitizedContent}
        </p>
      )}
    </div>
  );
});

export default SustainabilityContent;

import React, { memo, useMemo } from 'react';

interface SustainabilityContentProps {
  title?: string;
  content?: string;
}

const SustainabilityContent: React.FC<SustainabilityContentProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => (typeof title === 'string' ? title.trim() : ''), [title]);
  const sanitizedContent = useMemo(() => (typeof content === 'string' ? content.trim() : ''), [
    content,
  ]);

  return (
    <div
      className="sustainability-content"
      aria-label="Sustainability Content"
      role="region"
      data-testid="sustainability-content"
    >
      {sanitizedTitle && (
        <h1
          className="sustainability-title"
          aria-label="Sustainability Title"
          data-testid="sustainability-title"
        >
          {sanitizedTitle}
        </h1>
      )}
      {sanitizedContent && (
        <p
          className="sustainability-description"
          aria-label="Sustainability Description"
          data-testid="sustainability-description"
        >
          {sanitizedContent}
        </p>
      )}
    </div>
  );
});

export default SustainabilityContent;