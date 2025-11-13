import React, { memo, useMemo } from 'react';

interface CarbonCopyProps {
  title?: string;
  content?: string;
}

const CarbonCopy: React.FC<CarbonCopyProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => (typeof title === 'string' ? title.trim() : 'Untitled'), [title]);
  const sanitizedContent = useMemo(() => (typeof content === 'string' ? content.trim() : 'No content available'), [content]);

  return (
    <div className="carbon-copy-container" aria-label="Carbon Copy" role="region">
      <h1 className="carbon-copy-title" aria-label="Title" id="carbon-copy-title">
        {sanitizedTitle}
      </h1>
      <p className="carbon-copy-content" aria-label="Content" aria-describedby="carbon-copy-title">
        {sanitizedContent}
      </p>
    </div>
  );
});

CarbonCopy.displayName = 'CarbonCopy';

export default CarbonCopy;

import React, { memo, useMemo } from 'react';

interface CarbonCopyProps {
  title?: string;
  content?: string;
}

const CarbonCopy: React.FC<CarbonCopyProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => (typeof title === 'string' ? title.trim() : 'Untitled'), [title]);
  const sanitizedContent = useMemo(() => (typeof content === 'string' ? content.trim() : 'No content available'), [content]);

  return (
    <div className="carbon-copy-container" aria-label="Carbon Copy" role="region">
      <h1 className="carbon-copy-title" aria-label="Title" id="carbon-copy-title">
        {sanitizedTitle}
      </h1>
      <p className="carbon-copy-content" aria-label="Content" aria-describedby="carbon-copy-title">
        {sanitizedContent}
      </p>
    </div>
  );
});

CarbonCopy.displayName = 'CarbonCopy';

export default CarbonCopy;