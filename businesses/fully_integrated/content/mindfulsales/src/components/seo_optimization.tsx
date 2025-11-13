import { SEO_META_TAG as DefaultSEO_META_TAG } from './seo-constants-default';

export type SEO_META_TAG = {
  name: string;
  content: string;
};

export const SEO_META_TAGS = DefaultSEO_META_TAGS.filter(tag => {
  const { name, content } = tag;
  return typeof name === 'string' && typeof content === 'string';
});

export const validateSEO_META_TAGS = (tags: SEO_META_TAG[]): SEO_META_TAG[] => {
  return tags.filter(tag => {
    const { name, content } = tag;
    return typeof name === 'string' && typeof content === 'string';
  });
};

import { SEO_META_TAG } from './seo-constants';

const defaultSEO_META_TAGS: SEO_META_TAG[] = [
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { name: 'robots', content: 'index, follow' },
  { name: 'googlebot', content: 'index, follow' },
  { name: 'msapplication-TileColor', content: '#da532c' },
  { name: 'msapplication-config', content: '/browserconfig.xml' },
  { name: 'theme-color', content: '#ffffff' },
];

defaultSEO_META_TAGS.forEach(tag => {
  if (!SEO_META_TAGS.some(defaultTag => defaultTag.name === tag.name)) {
    SEO_META_TAGS.push(tag);
  }
});

export const SEO_META_TAGS_DEFAULT = SEO_META_TAGS;

import React from 'react';
import PropTypes from 'prop-types';
import { SEO_META_TAGS, validateSEO_META_TAGS } from './seo-constants';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
}

const MyComponent: React.FC<Props> = ({ title, description = '', keywords }) => {
  const validatedTags = validateSEO_META_TAGS(SEO_META_TAGS);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.map((keyword, index) => (
        <meta name="keywords" key={index} content={keyword} />
      ))}
      {validatedTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        aria-hidden="true"
      />
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        aria-label={description}
      />
    </>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export default MyComponent;

import { SEO_META_TAG as DefaultSEO_META_TAG } from './seo-constants-default';

export type SEO_META_TAG = {
  name: string;
  content: string;
};

export const SEO_META_TAGS = DefaultSEO_META_TAGS.filter(tag => {
  const { name, content } = tag;
  return typeof name === 'string' && typeof content === 'string';
});

export const validateSEO_META_TAGS = (tags: SEO_META_TAG[]): SEO_META_TAG[] => {
  return tags.filter(tag => {
    const { name, content } = tag;
    return typeof name === 'string' && typeof content === 'string';
  });
};

import { SEO_META_TAG } from './seo-constants';

const defaultSEO_META_TAGS: SEO_META_TAG[] = [
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { name: 'robots', content: 'index, follow' },
  { name: 'googlebot', content: 'index, follow' },
  { name: 'msapplication-TileColor', content: '#da532c' },
  { name: 'msapplication-config', content: '/browserconfig.xml' },
  { name: 'theme-color', content: '#ffffff' },
];

defaultSEO_META_TAGS.forEach(tag => {
  if (!SEO_META_TAGS.some(defaultTag => defaultTag.name === tag.name)) {
    SEO_META_TAGS.push(tag);
  }
});

export const SEO_META_TAGS_DEFAULT = SEO_META_TAGS;

import React from 'react';
import PropTypes from 'prop-types';
import { SEO_META_TAGS, validateSEO_META_TAGS } from './seo-constants';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
}

const MyComponent: React.FC<Props> = ({ title, description = '', keywords }) => {
  const validatedTags = validateSEO_META_TAGS(SEO_META_TAGS);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.map((keyword, index) => (
        <meta name="keywords" key={index} content={keyword} />
      ))}
      {validatedTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        aria-hidden="true"
      />
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        aria-label={description}
      />
    </>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export default MyComponent;

**seo-constants-default.ts**

**MyComponent.tsx**