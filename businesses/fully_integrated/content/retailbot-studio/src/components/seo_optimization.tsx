import React, { useState, useEffect } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  message?: string;
  seoImage?: string;
}

const MyComponent: React.FC<Props> = ({ seoTitle, seoDescription, message, seoImage }) => {
  const [ogImage, setOgImage] = useState(seoImage || '/default-og-image.png');

  useEffect(() => {
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImage);
  }, [ogImage]);

  return (
    <div>
      {/* Add Open Graph tags for social media sharing */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Add SEO-friendly heading for accessibility and SEO */}
      <h1 id="my-component-title" aria-level={1}>{seoTitle}</h1>

      {/* Use dangerouslySetInnerHTML for safe handling of user-generated content */}
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}

      {/* Add fallback image for ogImage */}
      <img src={ogImage} alt="" onError={(e) => { e.target.src = '/fallback-og-image.png'; }} style={{ display: 'none' }} />
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  message?: string;
  seoImage?: string;
}

const MyComponent: React.FC<Props> = ({ seoTitle, seoDescription, message, seoImage }) => {
  const [ogImage, setOgImage] = useState(seoImage || '/default-og-image.png');

  useEffect(() => {
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImage);
  }, [ogImage]);

  return (
    <div>
      {/* Add Open Graph tags for social media sharing */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Add SEO-friendly heading for accessibility and SEO */}
      <h1 id="my-component-title" aria-level={1}>{seoTitle}</h1>

      {/* Use dangerouslySetInnerHTML for safe handling of user-generated content */}
      {message && <div dangerouslySetInnerHTML={{ __html: message }} />}

      {/* Add fallback image for ogImage */}
      <img src={ogImage} alt="" onError={(e) => { e.target.src = '/fallback-og-image.png'; }} style={{ display: 'none' }} />
    </div>
  );
};

export default MyComponent;