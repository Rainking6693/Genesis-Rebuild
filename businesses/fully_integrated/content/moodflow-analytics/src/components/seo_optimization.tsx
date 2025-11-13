import React from 'react';
import { SEO as SEOComponent, SEOProps } from 'seo-darwin';

type DefaultSEO = ReturnType<typeof getDefaultSEO>;

type MyComponentProps = SEOProps & {
  message: string;
  image?: string;
};

function getDefaultSEO(): DefaultSEO {
  return {
    title: 'MoodFlow Analytics - AI-powered Emotional Wellness Platform',
    description: 'Improve productivity and retention by tracking team emotional wellness with MoodFlow Analytics.',
    keywords: ['MoodFlow Analytics', 'AI', 'Emotional Wellness', 'Mental Health', 'Business Intelligence', 'Small Business', 'Burnout Prevention'],
    image: '/moodflow-analytics-logo.png',
    url: 'https://www.moodflowanalytics.com',
  };
}

const imageAltText = 'MoodFlow Analytics logo';

const MyComponent: React.FC<MyComponentProps> = ({ message, image = getDefaultSEO().image, ...seoProps }) => {
  return (
    <>
      <SEOComponent {...(seoProps || getDefaultSEO())} />
      <img src={image} alt={imageAltText} />
      <div>{message}</div>
    </>
  );
};

MyComponent.defaultProps = getDefaultSEO();

export default MyComponent;

import React from 'react';
import { SEO as SEOComponent, SEOProps } from 'seo-darwin';

type DefaultSEO = ReturnType<typeof getDefaultSEO>;

type MyComponentProps = SEOProps & {
  message: string;
  image?: string;
};

function getDefaultSEO(): DefaultSEO {
  return {
    title: 'MoodFlow Analytics - AI-powered Emotional Wellness Platform',
    description: 'Improve productivity and retention by tracking team emotional wellness with MoodFlow Analytics.',
    keywords: ['MoodFlow Analytics', 'AI', 'Emotional Wellness', 'Mental Health', 'Business Intelligence', 'Small Business', 'Burnout Prevention'],
    image: '/moodflow-analytics-logo.png',
    url: 'https://www.moodflowanalytics.com',
  };
}

const imageAltText = 'MoodFlow Analytics logo';

const MyComponent: React.FC<MyComponentProps> = ({ message, image = getDefaultSEO().image, ...seoProps }) => {
  return (
    <>
      <SEOComponent {...(seoProps || getDefaultSEO())} />
      <img src={image} alt={imageAltText} />
      <div>{message}</div>
    </>
  );
};

MyComponent.defaultProps = getDefaultSEO();

export default MyComponent;