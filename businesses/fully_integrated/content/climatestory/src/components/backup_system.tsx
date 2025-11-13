import React, { memo, ReactNode, useMemo } from 'react';

interface SustainabilityStoryCardProps {
  storyTitle?: string;
  storyDescription?: string;
  children?: ReactNode;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = memo(
  ({ storyTitle = 'Untitled Story', storyDescription = 'No description available.', children }) => {
    const hasContent = useMemo(() => Boolean(storyTitle || storyDescription || children), [
      storyTitle,
      storyDescription,
      children,
    ]);

    if (!hasContent) {
      return null;
    }

    return (
      <div data-testid="sustainability-story-card" className="sustainability-story-card">
        <h2 data-testid="story-title" className="story-title">
          {storyTitle}
        </h2>
        <p data-testid="story-description" className="story-description">
          {storyDescription}
        </p>
        {children && <div className="story-content">{children}</div>}
      </div>
    );
  }
);

SustainabilityStoryCard.displayName = 'SustainabilityStoryCard';

export default SustainabilityStoryCard;

import React, { memo, ReactNode, useMemo } from 'react';

interface SustainabilityStoryCardProps {
  storyTitle?: string;
  storyDescription?: string;
  children?: ReactNode;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = memo(
  ({ storyTitle = 'Untitled Story', storyDescription = 'No description available.', children }) => {
    const hasContent = useMemo(() => Boolean(storyTitle || storyDescription || children), [
      storyTitle,
      storyDescription,
      children,
    ]);

    if (!hasContent) {
      return null;
    }

    return (
      <div data-testid="sustainability-story-card" className="sustainability-story-card">
        <h2 data-testid="story-title" className="story-title">
          {storyTitle}
        </h2>
        <p data-testid="story-description" className="story-description">
          {storyDescription}
        </p>
        {children && <div className="story-content">{children}</div>}
      </div>
    );
  }
);

SustainabilityStoryCard.displayName = 'SustainabilityStoryCard';

export default SustainabilityStoryCard;