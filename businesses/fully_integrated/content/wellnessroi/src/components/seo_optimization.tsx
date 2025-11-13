import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  twitterImageUrl?: string;
  ogType?: string;
  children: React.ReactNode;
  robots?: string; // Allow control over robots meta tag
  twitterCard?: string;
  locale?: string;
  ogSiteName?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
  }>;
}

const DefaultOgType: string = 'website';
const DefaultTwitterCard: string = 'summary_large_image';
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * SEOOptimization Component: Manages SEO-related meta tags using React Helmet.
 *
 * This component enhances SEO by dynamically injecting meta tags into the document head.
 * It supports title, description, keywords, canonical URL, Open Graph (Facebook), and Twitter meta tags.
 *
 * @param {SEOProps} props - The properties for the SEOOptimization component.
 * @param {string} props.title - The title of the page.  Required.  Will be truncated if too long.
 * @param {string} props.description - The description of the page. Required. Will be truncated if too long.
 * @param {string} props.keywords - The keywords for the page. Required.
 * @param {string} [props.canonicalUrl] - The canonical URL of the page. Optional.
 * @param {string} [props.ogImageUrl] - The Open Graph image URL. Optional.
 * @param {string} [props.twitterImageUrl] - The Twitter image URL. Optional.
 * @param {string} [props.ogType] - The Open Graph type. Defaults to "website". Optional.
 * @param {React.ReactNode} props.children - The content to be rendered within the component. Required.
 * @param {string} [props.robots] - Controls how search engine crawlers behave.  Example: "index, follow". Optional.
 * @param {string} [props.twitterCard] - The Twitter card type. Defaults to "summary_large_image". Optional.
 * @param {string} [props.locale] - The locale of the page. Optional.
 * @param {string} [props.ogSiteName] - The Open Graph site name. Optional.
 * @param {string} [props.articlePublishedTime] - The article published time in ISO 8601 format. Optional.
 * @param {string} [props.articleModifiedTime] - The article modified time in ISO 8601 format. Optional.
 * @param {Array<{name?: string; property?: string; content: string;}>} [props.additionalMetaTags] - Array of additional meta tags. Optional.
 * @param {Array<{rel: string; href: string;}>} [props.additionalLinkTags] - Array of additional link tags. Optional.
 *
 * @returns {JSX.Element} - The SEOOptimization component.
 *
 * @example
 *

 * <SEOOptimization
 *   title="My Awesome Page"
 *   description="This is a description of my awesome page."
 *   keywords="awesome, page, seo"
 *   canonicalUrl="https://www.example.com/awesome-page"
 *   ogImageUrl="https://www.example.com/images/awesome-page.jpg"
 *   twitterImageUrl="https://www.example.com/images/awesome-page.jpg"
 *   ogType="article"
 *   robots="index, follow"
 *   locale="en_US"
 *   ogSiteName="My Awesome Site"
 *   articlePublishedTime="2023-10-26T10:00:00-07:00"
 *   articleModifiedTime="2023-10-27T10:00:00-07:00"
 *   additionalMetaTags={[
 *     { name: 'custom-meta', content: 'custom-value' },
 *     { property: 'og:custom', content: 'custom-value' },
 *   ]}
 *   additionalLinkTags={[
 *     { rel: 'alternate', href: 'https://www.example.com/awesome-page.amp' },
 *   ]}
 * >
 *   <div>Content of my awesome page</div>
 * </SEOOptimization>
 *

 */
const SEOOptimization: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImageUrl,
  twitterImageUrl,
  ogType = DefaultOgType,
  children,
  robots,
  twitterCard = DefaultTwitterCard,
  locale,
  ogSiteName,
  articlePublishedTime,
  articleModifiedTime,
  additionalMetaTags,
  additionalLinkTags,
}) => {
  // Sanitize and truncate title and description to prevent errors and improve display
  const safeTitle = (title || '').substring(0, MAX_TITLE_LENGTH).trim();
  const safeDescription = (description || '').substring(0, MAX_DESCRIPTION_LENGTH).trim();
  const safeKeywords = keywords || '';

  const metaTags = [
    { name: 'description', content: safeDescription },
    { name: 'keywords', content: safeKeywords },
  ];

  if (robots) {
    metaTags.push({ name: 'robots', content: robots });
  }

  const ogMetaTags = [
    { property: 'og:title', content: safeTitle },
    { property: 'og:description', content: safeDescription },
    { property: 'og:type', content: ogType },
  ];

  if (canonicalUrl) {
    ogMetaTags.push({ property: 'og:url', content: canonicalUrl });
  }

  if (ogImageUrl) {
    ogMetaTags.push({ property: 'og:image', content: ogImageUrl });
  }

  if (locale) {
    ogMetaTags.push({ property: 'og:locale', content: locale });
  }

  if (ogSiteName) {
    ogMetaTags.push({ property: 'og:site_name', content: ogSiteName });
  }

  if (articlePublishedTime) {
    ogMetaTags.push({ property: 'article:published_time', content: articlePublishedTime });
  }

  if (articleModifiedTime) {
    ogMetaTags.push({ property: 'article:modified_time', content: articleModifiedTime });
  }

  const twitterMetaTags = [
    { name: 'twitter:card', content: twitterCard },
    { name: 'twitter:title', content: safeTitle },
    { name: 'twitter:description', content: safeDescription },
  ];

  if (twitterImageUrl) {
    twitterMetaTags.push({ name: 'twitter:image', content: twitterImageUrl });
  }

  return (
    <>
      <Helmet
        title={safeTitle}
        meta={[
          ...metaTags,
          ...ogMetaTags,
          ...twitterMetaTags,
          ...(additionalMetaTags || []),
        ]}
        link={[
          ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
          ...(additionalLinkTags || []),
        ]}
      />
      {children}
    </>
  );
};

export default SEOOptimization;

import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  twitterImageUrl?: string;
  ogType?: string;
  children: React.ReactNode;
  robots?: string; // Allow control over robots meta tag
  twitterCard?: string;
  locale?: string;
  ogSiteName?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
  }>;
}

const DefaultOgType: string = 'website';
const DefaultTwitterCard: string = 'summary_large_image';
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * SEOOptimization Component: Manages SEO-related meta tags using React Helmet.
 *
 * This component enhances SEO by dynamically injecting meta tags into the document head.
 * It supports title, description, keywords, canonical URL, Open Graph (Facebook), and Twitter meta tags.
 *
 * @param {SEOProps} props - The properties for the SEOOptimization component.
 * @param {string} props.title - The title of the page.  Required.  Will be truncated if too long.
 * @param {string} props.description - The description of the page. Required. Will be truncated if too long.
 * @param {string} props.keywords - The keywords for the page. Required.
 * @param {string} [props.canonicalUrl] - The canonical URL of the page. Optional.
 * @param {string} [props.ogImageUrl] - The Open Graph image URL. Optional.
 * @param {string} [props.twitterImageUrl] - The Twitter image URL. Optional.
 * @param {string} [props.ogType] - The Open Graph type. Defaults to "website". Optional.
 * @param {React.ReactNode} props.children - The content to be rendered within the component. Required.
 * @param {string} [props.robots] - Controls how search engine crawlers behave.  Example: "index, follow". Optional.
 * @param {string} [props.twitterCard] - The Twitter card type. Defaults to "summary_large_image". Optional.
 * @param {string} [props.locale] - The locale of the page. Optional.
 * @param {string} [props.ogSiteName] - The Open Graph site name. Optional.
 * @param {string} [props.articlePublishedTime] - The article published time in ISO 8601 format. Optional.
 * @param {string} [props.articleModifiedTime] - The article modified time in ISO 8601 format. Optional.
 * @param {Array<{name?: string; property?: string; content: string;}>} [props.additionalMetaTags] - Array of additional meta tags. Optional.
 * @param {Array<{rel: string; href: string;}>} [props.additionalLinkTags] - Array of additional link tags. Optional.
 *
 * @returns {JSX.Element} - The SEOOptimization component.
 *
 * @example
 *

 * <SEOOptimization
 *   title="My Awesome Page"
 *   description="This is a description of my awesome page."
 *   keywords="awesome, page, seo"
 *   canonicalUrl="https://www.example.com/awesome-page"
 *   ogImageUrl="https://www.example.com/images/awesome-page.jpg"
 *   twitterImageUrl="https://www.example.com/images/awesome-page.jpg"
 *   ogType="article"
 *   robots="index, follow"
 *   locale="en_US"
 *   ogSiteName="My Awesome Site"
 *   articlePublishedTime="2023-10-26T10:00:00-07:00"
 *   articleModifiedTime="2023-10-27T10:00:00-07:00"
 *   additionalMetaTags={[
 *     { name: 'custom-meta', content: 'custom-value' },
 *     { property: 'og:custom', content: 'custom-value' },
 *   ]}
 *   additionalLinkTags={[
 *     { rel: 'alternate', href: 'https://www.example.com/awesome-page.amp' },
 *   ]}
 * >
 *   <div>Content of my awesome page</div>
 * </SEOOptimization>
 *

 */
const SEOOptimization: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImageUrl,
  twitterImageUrl,
  ogType = DefaultOgType,
  children,
  robots,
  twitterCard = DefaultTwitterCard,
  locale,
  ogSiteName,
  articlePublishedTime,
  articleModifiedTime,
  additionalMetaTags,
  additionalLinkTags,
}) => {
  // Sanitize and truncate title and description to prevent errors and improve display
  const safeTitle = (title || '').substring(0, MAX_TITLE_LENGTH).trim();
  const safeDescription = (description || '').substring(0, MAX_DESCRIPTION_LENGTH).trim();
  const safeKeywords = keywords || '';

  const metaTags = [
    { name: 'description', content: safeDescription },
    { name: 'keywords', content: safeKeywords },
  ];

  if (robots) {
    metaTags.push({ name: 'robots', content: robots });
  }

  const ogMetaTags = [
    { property: 'og:title', content: safeTitle },
    { property: 'og:description', content: safeDescription },
    { property: 'og:type', content: ogType },
  ];

  if (canonicalUrl) {
    ogMetaTags.push({ property: 'og:url', content: canonicalUrl });
  }

  if (ogImageUrl) {
    ogMetaTags.push({ property: 'og:image', content: ogImageUrl });
  }

  if (locale) {
    ogMetaTags.push({ property: 'og:locale', content: locale });
  }

  if (ogSiteName) {
    ogMetaTags.push({ property: 'og:site_name', content: ogSiteName });
  }

  if (articlePublishedTime) {
    ogMetaTags.push({ property: 'article:published_time', content: articlePublishedTime });
  }

  if (articleModifiedTime) {
    ogMetaTags.push({ property: 'article:modified_time', content: articleModifiedTime });
  }

  const twitterMetaTags = [
    { name: 'twitter:card', content: twitterCard },
    { name: 'twitter:title', content: safeTitle },
    { name: 'twitter:description', content: safeDescription },
  ];

  if (twitterImageUrl) {
    twitterMetaTags.push({ name: 'twitter:image', content: twitterImageUrl });
  }

  return (
    <>
      <Helmet
        title={safeTitle}
        meta={[
          ...metaTags,
          ...ogMetaTags,
          ...twitterMetaTags,
          ...(additionalMetaTags || []),
        ]}
        link={[
          ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
          ...(additionalLinkTags || []),
        ]}
      />
      {children}
    </>
  );
};

export default SEOOptimization;