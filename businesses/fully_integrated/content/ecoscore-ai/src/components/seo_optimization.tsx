import React from 'react';
import { SEO_META_TAGS_DEFAULT, getSEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  googlebot?: string;
  msapplicationTileColor?: string;
  msapplicationConfig?: string;
  themeColor?: string;
}

const MyComponent: React.FC<Props> = ({
  title,
  description = '',
  keywords,
  author = 'EcoScore AI',
  robots = 'index, follow',
  googlebot = 'index, follow',
  msapplicationTileColor = '#007bff',
  msapplicationConfig = '/browserconfig.xml',
  themeColor = '#007bff',
}) => {
  const seoMetaTags = getSEO_META_TAGS(title, author, keywords, robots, googlebot, msapplicationTileColor, msapplicationConfig, themeColor);

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {seoMetaTags.map((tag) => (
        <meta key={tag.name} name={tag.name} content={tag.content} />
      ))}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default MyComponent;

export const SEO_META_TAGS_DEFAULT = [
  { name: 'author', content: 'EcoScore AI' },
  { name: 'keywords', content: 'sustainability, carbon footprint, small businesses, AI, analytics, environmental data, branded reports' },
  { name: 'robots', content: 'index, follow' },
  { name: 'googlebot', content: 'index, follow' },
  { name: 'msapplication-TileColor', content: '#007bff' },
  { name: 'msapplication-config', content: '/browserconfig.xml' },
  { name: 'theme-color', content: '#007bff' },
];

export const getSEO_META_TAGS = (title: string, author: string, keywords: string, robots: string, googlebot: string, msapplicationTileColor: string, msapplicationConfig: string, themeColor: string) => {
  const seoMetaTags = [...SEO_META_TAGS_DEFAULT];

  if (title) {
    seoMetaTags.push({ name: 'title', content: title });
  }

  if (author) {
    seoMetaTags.push({ name: 'author', content: author });
  }

  if (keywords) {
    seoMetaTags.push({ name: 'keywords', content: keywords });
  }

  if (robots) {
    seoMetaTags.push({ name: 'robots', content: robots });
  }

  if (googlebot) {
    seoMetaTags.push({ name: 'googlebot', content: googlebot });
  }

  if (msapplicationTileColor) {
    seoMetaTags.push({ name: 'msapplication-TileColor', content: msapplicationTileColor });
  }

  if (msapplicationConfig) {
    seoMetaTags.push({ name: 'msapplication-config', content: msapplicationConfig });
  }

  if (themeColor) {
    seoMetaTags.push({ name: 'theme-color', content: themeColor });
  }

  return seoMetaTags.filter((tag) => tag.content);
};

import React from 'react';
import { SEO_META_TAGS_DEFAULT, getSEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  googlebot?: string;
  msapplicationTileColor?: string;
  msapplicationConfig?: string;
  themeColor?: string;
}

const MyComponent: React.FC<Props> = ({
  title,
  description = '',
  keywords,
  author = 'EcoScore AI',
  robots = 'index, follow',
  googlebot = 'index, follow',
  msapplicationTileColor = '#007bff',
  msapplicationConfig = '/browserconfig.xml',
  themeColor = '#007bff',
}) => {
  const seoMetaTags = getSEO_META_TAGS(title, author, keywords, robots, googlebot, msapplicationTileColor, msapplicationConfig, themeColor);

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {seoMetaTags.map((tag) => (
        <meta key={tag.name} name={tag.name} content={tag.content} />
      ))}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default MyComponent;

export const SEO_META_TAGS_DEFAULT = [
  { name: 'author', content: 'EcoScore AI' },
  { name: 'keywords', content: 'sustainability, carbon footprint, small businesses, AI, analytics, environmental data, branded reports' },
  { name: 'robots', content: 'index, follow' },
  { name: 'googlebot', content: 'index, follow' },
  { name: 'msapplication-TileColor', content: '#007bff' },
  { name: 'msapplication-config', content: '/browserconfig.xml' },
  { name: 'theme-color', content: '#007bff' },
];

export const getSEO_META_TAGS = (title: string, author: string, keywords: string, robots: string, googlebot: string, msapplicationTileColor: string, msapplicationConfig: string, themeColor: string) => {
  const seoMetaTags = [...SEO_META_TAGS_DEFAULT];

  if (title) {
    seoMetaTags.push({ name: 'title', content: title });
  }

  if (author) {
    seoMetaTags.push({ name: 'author', content: author });
  }

  if (keywords) {
    seoMetaTags.push({ name: 'keywords', content: keywords });
  }

  if (robots) {
    seoMetaTags.push({ name: 'robots', content: robots });
  }

  if (googlebot) {
    seoMetaTags.push({ name: 'googlebot', content: googlebot });
  }

  if (msapplicationTileColor) {
    seoMetaTags.push({ name: 'msapplication-TileColor', content: msapplicationTileColor });
  }

  if (msapplicationConfig) {
    seoMetaTags.push({ name: 'msapplication-config', content: msapplicationConfig });
  }

  if (themeColor) {
    seoMetaTags.push({ name: 'theme-color', content: themeColor });
  }

  return seoMetaTags.filter((tag) => tag.content);
};

SEO_CONSTANTS.ts: