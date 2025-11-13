import React, { memo, useMemo } from 'react';

interface MeetingMindComponentProps {
  title?: string;
  content?: string;
}

const MeetingMindComponent: React.FC<MeetingMindComponentProps> = memo(({ title, content }) => {
  // Memoize the rendering to avoid unnecessary re-renders
  const renderedTitle = useMemo(() => title || 'Default Title', [title]);
  const renderedContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="meeting-mind-component"
      aria-label="Meeting Mind Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="meeting-mind-title"
        aria-label="Meeting Mind Title"
        tabIndex={0}
        className="meeting-mind-title"
      >
        {renderedTitle}
      </h1>
      <p
        data-testid="meeting-mind-content"
        aria-label="Meeting Mind Content"
        tabIndex={0}
        className="meeting-mind-content"
      >
        {renderedContent}
      </p>
    </div>
  );
});

export default MeetingMindComponent;

import React, { memo, useMemo } from 'react';

interface MeetingMindComponentProps {
  title?: string;
  content?: string;
}

const MeetingMindComponent: React.FC<MeetingMindComponentProps> = memo(({ title, content }) => {
  // Memoize the rendering to avoid unnecessary re-renders
  const renderedTitle = useMemo(() => title || 'Default Title', [title]);
  const renderedContent = useMemo(() => content || 'Default Content', [content]);

  return (
    <div
      data-testid="meeting-mind-component"
      aria-label="Meeting Mind Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="meeting-mind-title"
        aria-label="Meeting Mind Title"
        tabIndex={0}
        className="meeting-mind-title"
      >
        {renderedTitle}
      </h1>
      <p
        data-testid="meeting-mind-content"
        aria-label="Meeting Mind Content"
        tabIndex={0}
        className="meeting-mind-content"
      >
        {renderedContent}
      </p>
    </div>
  );
});

export default MeetingMindComponent;