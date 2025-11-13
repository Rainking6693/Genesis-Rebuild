import React from 'react';
import { SEO } from 'seo-darwin';

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  lang?: string;
  type?: string;
  region?: string;
  // Add more properties as needed
}

const defaultSEOProps: Props = {
  title: 'Default Title',
  description: 'Default Description',
  keywords: ['default', 'keywords'],
  url: '',
  image: '',
  lang: 'en-US',
  type: 'website',
  region: 'US',
};

const MyComponent: React.FC<Props> = ({ message, ...seoProps }) => {
  const mergedProps = { ...defaultSEOProps, ...seoProps };

  // Validate required properties
  if (!mergedProps.title || !mergedProps.url) {
    throw new Error('Title and URL are required.');
  }

  // Handle edge cases for empty strings and undefined values
  mergedProps.title = mergedProps.title?.trim() || defaultSEOProps.title;
  mergedProps.description = mergedProps.description?.trim() || defaultSEOProps.description;
  mergedProps.keywords = (mergedProps.keywords || []).filter(Boolean) || defaultSEOProps.keywords;
  mergedProps.url = mergedProps.url?.trim() || defaultSEOProps.url;
  mergedProps.image = mergedProps.image?.trim() || defaultSEOProps.image;

  // Ensure all properties are strings
  Object.keys(mergedProps).forEach((key) => {
    if (typeof mergedProps[key] !== 'string') {
      mergedProps[key] = String(mergedProps[key]);
    }
  });

  // Handle edge case for invalid URL
  try {
    new URL(mergedProps.url);
  } catch (error) {
    throw new Error('Invalid URL provided.');
  }

  // Ensure all properties are valid for SEO
  const validSEOProperties = Object.keys(SEO.schema.org.WebPage) as (keyof typeof SEO.schema.org.WebPage)[];
  validSEOProperties.forEach((property) => {
    if (!mergedProps.hasOwnProperty(property)) {
      mergedProps[property] = defaultSEOProps[property];
    }
  });

  return (
    <>
      <SEO {...mergedProps} />
      <div>{message}</div>
    </>
  );
};

export default MyComponent;

import React from 'react';
import { SEO } from 'seo-darwin';

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  lang?: string;
  type?: string;
  region?: string;
  // Add more properties as needed
}

const defaultSEOProps: Props = {
  title: 'Default Title',
  description: 'Default Description',
  keywords: ['default', 'keywords'],
  url: '',
  image: '',
  lang: 'en-US',
  type: 'website',
  region: 'US',
};

const MyComponent: React.FC<Props> = ({ message, ...seoProps }) => {
  const mergedProps = { ...defaultSEOProps, ...seoProps };

  // Validate required properties
  if (!mergedProps.title || !mergedProps.url) {
    throw new Error('Title and URL are required.');
  }

  // Handle edge cases for empty strings and undefined values
  mergedProps.title = mergedProps.title?.trim() || defaultSEOProps.title;
  mergedProps.description = mergedProps.description?.trim() || defaultSEOProps.description;
  mergedProps.keywords = (mergedProps.keywords || []).filter(Boolean) || defaultSEOProps.keywords;
  mergedProps.url = mergedProps.url?.trim() || defaultSEOProps.url;
  mergedProps.image = mergedProps.image?.trim() || defaultSEOProps.image;

  // Ensure all properties are strings
  Object.keys(mergedProps).forEach((key) => {
    if (typeof mergedProps[key] !== 'string') {
      mergedProps[key] = String(mergedProps[key]);
    }
  });

  // Handle edge case for invalid URL
  try {
    new URL(mergedProps.url);
  } catch (error) {
    throw new Error('Invalid URL provided.');
  }

  // Ensure all properties are valid for SEO
  const validSEOProperties = Object.keys(SEO.schema.org.WebPage) as (keyof typeof SEO.schema.org.WebPage)[];
  validSEOProperties.forEach((property) => {
    if (!mergedProps.hasOwnProperty(property)) {
      mergedProps[property] = defaultSEOProps[property];
    }
  });

  return (
    <>
      <SEO {...mergedProps} />
      <div>{message}</div>
    </>
  );
};

export default MyComponent;