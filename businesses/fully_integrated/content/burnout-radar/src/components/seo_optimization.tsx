import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  keywords?: string[];
}

const MyComponent: React.FC<Props> = ({ title, description, keywords }) => {
  const defaultKeywords = ['content', 'business', 'seo', 'optimization'];
  const allKeywords = keywords || defaultKeywords;

  // Validate the title and description to ensure they are non-empty strings
  if (!title || !description) {
    throw new Error('Title and description are required');
  }

  // Ensure the keywords array is an array and not null or undefined
  if (!Array.isArray(allKeywords)) {
    allKeywords = defaultKeywords;
  }

  // Filter out empty strings from the keywords array
  allKeywords = allKeywords.filter(keyword => keyword);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {allKeywords.map((keyword, index) => (
        <meta name="keywords" key={index} content={keyword} />
      ))}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.burnoutradar.com/page" />
      {SEO_META_TAGS.map((tag, index) => (
        <meta name={tag.name} content={tag.content} key={index} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default MyComponent;

import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  keywords?: string[];
}

const MyComponent: React.FC<Props> = ({ title, description, keywords }) => {
  const defaultKeywords = ['content', 'business', 'seo', 'optimization'];
  const allKeywords = keywords || defaultKeywords;

  // Validate the title and description to ensure they are non-empty strings
  if (!title || !description) {
    throw new Error('Title and description are required');
  }

  // Ensure the keywords array is an array and not null or undefined
  if (!Array.isArray(allKeywords)) {
    allKeywords = defaultKeywords;
  }

  // Filter out empty strings from the keywords array
  allKeywords = allKeywords.filter(keyword => keyword);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {allKeywords.map((keyword, index) => (
        <meta name="keywords" key={index} content={keyword} />
      ))}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.burnoutradar.com/page" />
      {SEO_META_TAGS.map((tag, index) => (
        <meta name={tag.name} content={tag.content} key={index} />
      ))}
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default MyComponent;