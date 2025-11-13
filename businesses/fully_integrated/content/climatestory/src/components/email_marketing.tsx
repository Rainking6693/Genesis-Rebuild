import React, { ReactElement } from 'react';

interface SustainabilityStoryCardProps {
  title: string;
  content: string;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = ({
  title,
  content,
}): ReactElement => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    console.error('SustainabilityStoryCard: title and content props must be strings.');
    return null;
  }

  if (title.trim() === '' || content.trim() === '') {
    console.error('SustainabilityStoryCard: title and content props cannot be empty.');
    return null;
  }

  // Ensure accessibility
  const titleId = `sustainability-story-card-title-${Math.random().toString(36).substring(2, 9)}`;
  const contentId = `sustainability-story-card-content-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      data-testid="sustainability-story-card"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      role="region"
      aria-live="polite"
    >
      <h2 id={titleId} data-testid="title">
        {title}
      </h2>
      <p id={contentId} data-testid="content">
        {content}
      </p>
    </div>
  );
};

export default SustainabilityStoryCard;

import React, { ReactElement } from 'react';

interface SustainabilityStoryCardProps {
  title: string;
  content: string;
}

const SustainabilityStoryCard: React.FC<SustainabilityStoryCardProps> = ({
  title,
  content,
}): ReactElement => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    console.error('SustainabilityStoryCard: title and content props must be strings.');
    return null;
  }

  if (title.trim() === '' || content.trim() === '') {
    console.error('SustainabilityStoryCard: title and content props cannot be empty.');
    return null;
  }

  // Ensure accessibility
  const titleId = `sustainability-story-card-title-${Math.random().toString(36).substring(2, 9)}`;
  const contentId = `sustainability-story-card-content-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      data-testid="sustainability-story-card"
      aria-labelledby={titleId}
      aria-describedby={contentId}
      role="region"
      aria-live="polite"
    >
      <h2 id={titleId} data-testid="title">
        {title}
      </h2>
      <p id={contentId} data-testid="content">
        {content}
      </p>
    </div>
  );
};

export default SustainabilityStoryCard;