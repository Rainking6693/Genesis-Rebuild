import React from 'react';

interface SustainabilityStoryProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  alt?: string;
}

const SustainabilityStory: React.FC<SustainabilityStoryProps> = ({
  title = 'Untitled Sustainability Story',
  content = 'No content available.',
  imageUrl,
  alt = 'Sustainability Story',
}) => {
  return (
    <div className="sustainability-story">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className="story-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.jpg';
            (e.target as HTMLImageElement).alt = 'Fallback Image';
          }}
        />
      )}
      <h2 className="story-title" aria-label={title}>
        {title}
      </h2>
      <p className="story-content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default SustainabilityStory;

import React from 'react';

interface SustainabilityStoryProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  alt?: string;
}

const SustainabilityStory: React.FC<SustainabilityStoryProps> = ({
  title = 'Untitled Sustainability Story',
  content = 'No content available.',
  imageUrl,
  alt = 'Sustainability Story',
}) => {
  return (
    <div className="sustainability-story">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          className="story-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.jpg';
            (e.target as HTMLImageElement).alt = 'Fallback Image';
          }}
        />
      )}
      <h2 className="story-title" aria-label={title}>
        {title}
      </h2>
      <p className="story-content" aria-label={content}>
        {content}
      </p>
    </div>
  );
};

export default SustainabilityStory;