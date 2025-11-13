import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOOptimizationProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  imageUrl?: string;
  article?: boolean;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  datePublished?: string;
  dateModified?: string;
}

const defaultPublisherName = "EcoLaunch Academy";
const SEOOptimization: React.FC<SEOOptimizationProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  article = false,
  authorName,
  publisherName = defaultPublisherName,
  publisherLogoUrl,
  datePublished,
  dateModified,
}) => {
  const schemaType = article ? "Article" : "WebPage";
  const keywordsString = keywords.filter(keyword => typeof keyword === 'string' && keyword.trim() !== '').map(keyword => keyword.trim()).join(', ');
  const safeTitle = title || '';
  const safeDescription = description || '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl || ""
    },
    "headline": safeTitle,
    "description": safeDescription,
    "image": imageUrl || "",
    "keywords": keywordsString,
    "author": authorName ? {
      "@type": "Organization",
      "name": authorName
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": publisherLogoUrl ? {
        "@type": "ImageObject",
        "url": publisherLogoUrl
      } : undefined
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString()
  };

  // Remove undefined properties from JSON-LD to avoid schema validation errors
  const cleanJsonLd = Object.fromEntries(
    Object.entries(jsonLd).filter(([_, v]) => v != null)
  );

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={keywordsString} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={schemaType} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={safeTitle} />
      <meta property="twitter:description" content={safeDescription} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(cleanJsonLd, null, 2)}
      </script>
    </Helmet>
  );
};

export default SEOOptimization;

import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOOptimizationProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  imageUrl?: string;
  article?: boolean;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  datePublished?: string;
  dateModified?: string;
}

const defaultPublisherName = "EcoLaunch Academy";
const SEOOptimization: React.FC<SEOOptimizationProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl,
  article = false,
  authorName,
  publisherName = defaultPublisherName,
  publisherLogoUrl,
  datePublished,
  dateModified,
}) => {
  const schemaType = article ? "Article" : "WebPage";
  const keywordsString = keywords.filter(keyword => typeof keyword === 'string' && keyword.trim() !== '').map(keyword => keyword.trim()).join(', ');
  const safeTitle = title || '';
  const safeDescription = description || '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl || ""
    },
    "headline": safeTitle,
    "description": safeDescription,
    "image": imageUrl || "",
    "keywords": keywordsString,
    "author": authorName ? {
      "@type": "Organization",
      "name": authorName
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": publisherName,
      "logo": publisherLogoUrl ? {
        "@type": "ImageObject",
        "url": publisherLogoUrl
      } : undefined
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString()
  };

  // Remove undefined properties from JSON-LD to avoid schema validation errors
  const cleanJsonLd = Object.fromEntries(
    Object.entries(jsonLd).filter(([_, v]) => v != null)
  );

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={keywordsString} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={schemaType} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={safeTitle} />
      <meta property="twitter:description" content={safeDescription} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(cleanJsonLd, null, 2)}
      </script>
    </Helmet>
  );
};

export default SEOOptimization;