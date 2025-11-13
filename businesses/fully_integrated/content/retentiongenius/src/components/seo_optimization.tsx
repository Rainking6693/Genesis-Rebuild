import React, { useEffect, useMemo } from 'react';
import { SEO_META_TAGS } from '../../constants/seo';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string; // Add optional seoImage prop
}

const MyComponent: React.FC<Props> = ({ seoTitle, seoDescription, seoImage }) => {
  const metaTags = useMemo(() => {
    const tags = [
      { name: 'description', content: seoDescription },
      { name: 'og:title', content: seoTitle },
      { name: 'og:description', content: seoDescription },
      { name: 'og:image', content: seoImage }, // Use provided seoImage if available
      // Add more meta tags as needed
    ];

    return tags.map((tag) => (
      <meta key={tag.name} name={tag.name} content={tag.content} />
    ));
  }, [seoTitle, seoDescription, seoImage]);

  useEffect(() => {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
      head.innerHTML = ''; // Clear existing head content before appending new meta tags
      head.appendChild(...metaTags);
    }
    document.title = seoTitle;
  }, [seoTitle, ...metaTags]);

  return (
    <>
      <h1>{seoTitle}</h1>
      <div dangerouslySetInnerHTML={{ __html: seoDescription }} />
      {/* Add ARIA attributes for accessibility */}
      <h1 aria-level={1}>{seoTitle}</h1>
    </>
  );
};

export default MyComponent;

import React, { useEffect, useMemo } from 'react';
import { SEO_META_TAGS } from '../../constants/seo';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoImage?: string; // Add optional seoImage prop
}

const MyComponent: React.FC<Props> = ({ seoTitle, seoDescription, seoImage }) => {
  const metaTags = useMemo(() => {
    const tags = [
      { name: 'description', content: seoDescription },
      { name: 'og:title', content: seoTitle },
      { name: 'og:description', content: seoDescription },
      { name: 'og:image', content: seoImage }, // Use provided seoImage if available
      // Add more meta tags as needed
    ];

    return tags.map((tag) => (
      <meta key={tag.name} name={tag.name} content={tag.content} />
    ));
  }, [seoTitle, seoDescription, seoImage]);

  useEffect(() => {
    const head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
      head.innerHTML = ''; // Clear existing head content before appending new meta tags
      head.appendChild(...metaTags);
    }
    document.title = seoTitle;
  }, [seoTitle, ...metaTags]);

  return (
    <>
      <h1>{seoTitle}</h1>
      <div dangerouslySetInnerHTML={{ __html: seoDescription }} />
      {/* Add ARIA attributes for accessibility */}
      <h1 aria-level={1}>{seoTitle}</h1>
    </>
  );
};

export default MyComponent;