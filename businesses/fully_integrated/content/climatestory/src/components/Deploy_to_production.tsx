import React, { memo, useMemo, useCallback } from 'react';

interface SustainabilityStoryCardProps {
  title: string;
  content: string;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => title.trim(), [title]);
  const sanitizedContent = useMemo(() => content.trim(), [content]);

  const handleTitleClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus the content or scroll to it
    console.log('Title clicked:', sanitizedTitle);
  }, [sanitizedTitle]);

  const handleContentClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus the content or scroll to it
    console.log('Content clicked:', sanitizedContent);
  }, [sanitizedContent]);

  return (
    <div className="sustainability-story-card">
      <h1
        className="sustainability-story-card__title"
        aria-label={sanitizedTitle}
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
        tabIndex={0}
      >
        {sanitizedTitle}
      </h1>
      <p
        className="sustainability-story-card__content"
        aria-label={sanitizedContent}
        onClick={handleContentClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleContentClick();
          }
        }}
        tabIndex={0}
      >
        {sanitizedContent}
      </p>
    </div>
  );
});

export default SustainabilityStoryCard;

import React, { memo, useMemo, useCallback } from 'react';

interface SustainabilityStoryCardProps {
  title: string;
  content: string;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = memo(({ title, content }) => {
  const sanitizedTitle = useMemo(() => title.trim(), [title]);
  const sanitizedContent = useMemo(() => content.trim(), [content]);

  const handleTitleClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus the content or scroll to it
    console.log('Title clicked:', sanitizedTitle);
  }, [sanitizedTitle]);

  const handleContentClick = useCallback(() => {
    // Add accessibility-friendly behavior, e.g., focus the content or scroll to it
    console.log('Content clicked:', sanitizedContent);
  }, [sanitizedContent]);

  return (
    <div className="sustainability-story-card">
      <h1
        className="sustainability-story-card__title"
        aria-label={sanitizedTitle}
        onClick={handleTitleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTitleClick();
          }
        }}
        tabIndex={0}
      >
        {sanitizedTitle}
      </h1>
      <p
        className="sustainability-story-card__content"
        aria-label={sanitizedContent}
        onClick={handleContentClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleContentClick();
          }
        }}
        tabIndex={0}
      >
        {sanitizedContent}
      </p>
    </div>
  );
});

export default SustainabilityStoryCard;