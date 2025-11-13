import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  lang?: string;
}

const MyComponent: React.FC<Props> = ({ title, description, lang = 'en' }) => {
  const canonicalUrl = `https://www.yourwebsite.com${window.location.pathname}`;
  const localizedUrl = `${canonicalUrl}?lang=${lang}`;

  return (
    <>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content={lang} />
      {SEO_META_TAGS.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={localizedUrl} />
      <link rel="alternate" hrefLang="x-default" href={`https://www.yourwebsite.com/`} />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="#000000" />
      <div
        dangerouslySetInnerHTML={{
          __html: description.replace(/<.*?>/g, ''), // Remove any HTML tags to improve accessibility
        }}
      />
    </>
  );
};

export default MyComponent;

export const SEO_META_TAGS = [
  { name: 'description', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'keywords', content: 'SkillStack AI, microlearning, remote teams, project failures, knowledge gaps, AI, personalized skill development, bite-sized lessons, peer mentoring, team challenges' },
  { name: 'author', content: 'SkillStack AI' },
  { name: 'robots', content: 'index, follow' },
  { name: 'og:title', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'og:description', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'og:url', content: 'https://www.yourwebsite.com' },
  { name: 'og:image', content: 'https://www.yourwebsite.com/og-image.jpg' },
  { name: 'og:image:alt', content: 'SkillStack AI logo' },
  { name: 'og:type', content: 'website' },
];

import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  lang?: string;
}

const MyComponent: React.FC<Props> = ({ title, description, lang = 'en' }) => {
  const canonicalUrl = `https://www.yourwebsite.com${window.location.pathname}`;
  const localizedUrl = `${canonicalUrl}?lang=${lang}`;

  return (
    <>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content={lang} />
      {SEO_META_TAGS.map((tag, index) => (
        <meta key={index} name={tag.name} content={tag.content} />
      ))}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={localizedUrl} />
      <link rel="alternate" hrefLang="x-default" href={`https://www.yourwebsite.com/`} />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="theme-color" content="#000000" />
      <div
        dangerouslySetInnerHTML={{
          __html: description.replace(/<.*?>/g, ''), // Remove any HTML tags to improve accessibility
        }}
      />
    </>
  );
};

export default MyComponent;

export const SEO_META_TAGS = [
  { name: 'description', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'keywords', content: 'SkillStack AI, microlearning, remote teams, project failures, knowledge gaps, AI, personalized skill development, bite-sized lessons, peer mentoring, team challenges' },
  { name: 'author', content: 'SkillStack AI' },
  { name: 'robots', content: 'index, follow' },
  { name: 'og:title', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'og:description', content: 'SkillStack AI - Transforming workplace mistakes into structured learning opportunities' },
  { name: 'og:url', content: 'https://www.yourwebsite.com' },
  { name: 'og:image', content: 'https://www.yourwebsite.com/og-image.jpg' },
  { name: 'og:image:alt', content: 'SkillStack AI logo' },
  { name: 'og:type', content: 'website' },
];

SEO_CONSTANTS.ts: