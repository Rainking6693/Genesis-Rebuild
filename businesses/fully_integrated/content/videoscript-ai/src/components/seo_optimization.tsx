import React, { PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

interface Props {
  seoTitle: string;
  seoDescription: string;
  message: string;
}

interface MetaTags {
  property: string;
  content: string;
}

const metaTags: MetaTags[] = [
  { property: 'og:title', content: '' },
  { property: 'og:description', content: '' },
];

const VideoScriptComponent: React.FC<Props> = ({ seoTitle, seoDescription, message }) => {
  if (!DOMPurifyAvailable) {
    console.warn('DOMPurify library not found. User-generated content may be vulnerable to XSS attacks.');
  }

  // Add default values for seoTitle and seoDescription in case they are not provided
  const defaultSeoTitle = 'Video Script';
  const defaultSeoDescription = 'A video script for your content';

  // Validate the seoTitle and seoDescription to ensure they are not empty strings
  const validatedSeoTitle = seoTitle || defaultSeoTitle;
  const validatedSeoDescription = seoDescription || defaultSeoDescription;

  // Update the meta tags with the validated values
  metaTags[0].content = validatedSeoTitle;
  metaTags[1].content = validatedSeoDescription;

  // Add ARIA attributes for accessibility
  return (
    <div aria-label="Video Script">
      {/* Render the Open Graph tags */}
      {metaTags.map((tag) => (
        <meta key={tag.property} {...tag} />
      ))}

      {/* Use a sanitizer library to prevent XSS attacks for user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
    </div>
  );
};

export default VideoScriptComponent;

import React, { PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

interface Props {
  seoTitle: string;
  seoDescription: string;
  message: string;
}

interface MetaTags {
  property: string;
  content: string;
}

const metaTags: MetaTags[] = [
  { property: 'og:title', content: '' },
  { property: 'og:description', content: '' },
];

const VideoScriptComponent: React.FC<Props> = ({ seoTitle, seoDescription, message }) => {
  if (!DOMPurifyAvailable) {
    console.warn('DOMPurify library not found. User-generated content may be vulnerable to XSS attacks.');
  }

  // Add default values for seoTitle and seoDescription in case they are not provided
  const defaultSeoTitle = 'Video Script';
  const defaultSeoDescription = 'A video script for your content';

  // Validate the seoTitle and seoDescription to ensure they are not empty strings
  const validatedSeoTitle = seoTitle || defaultSeoTitle;
  const validatedSeoDescription = seoDescription || defaultSeoDescription;

  // Update the meta tags with the validated values
  metaTags[0].content = validatedSeoTitle;
  metaTags[1].content = validatedSeoDescription;

  // Add ARIA attributes for accessibility
  return (
    <div aria-label="Video Script">
      {/* Render the Open Graph tags */}
      {metaTags.map((tag) => (
        <meta key={tag.property} {...tag} />
      ))}

      {/* Use a sanitizer library to prevent XSS attacks for user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
    </div>
  );
};

export default VideoScriptComponent;