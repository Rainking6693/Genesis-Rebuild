import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

const MyComponent: React.FC<Props> = ({ title, description, url = window.location.href, imageUrl }) => {
  // Use a try-catch block to handle potential errors when getting the URL
  try {
    if (!url) {
      url = new URL(window.location.href).toString();
    }
  } catch (error) {
    console.error('Error getting URL:', error);
    url = window.location.href;
  }

  // Use a default image URL for the favicon and apple-touch-icon when imageUrl is not provided
  const defaultImageUrl = '/images/default-favicon.png';
  const faviconUrl = imageUrl || defaultImageUrl;

  // Use a default image URL for the mask-icon when imageUrl is not provided
  const maskIconUrl = imageUrl ? `${imageUrl}/safari-pinned-tab.svg` : '/safari-pinned-tab.svg';

  // Use a default image URL for the manifest when imageUrl is not provided
  const manifestUrl = imageUrl ? `${imageUrl}/site.webmanifest` : '/site.webmanifest';

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {SEO_META_TAGS.map((tag) => (
        <meta key={tag.name} name={tag.name} content={tag.content} />
      ))}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" href={faviconUrl} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${faviconUrl}/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${faviconUrl}/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${faviconUrl}/favicon-16x16.png`}
      />
      <link rel="manifest" href={manifestUrl} />
      <link rel="mask-icon" href={maskIconUrl} color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      {/* Use aria-hidden to make the description accessible */}
      <div aria-hidden style={{ display: 'none' }}>
        {description}
      </div>
    </>
  );
};

export default MyComponent;

import React from 'react';
import { SEO_META_TAGS } from './seo_constants';

interface Props {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

const MyComponent: React.FC<Props> = ({ title, description, url = window.location.href, imageUrl }) => {
  // Use a try-catch block to handle potential errors when getting the URL
  try {
    if (!url) {
      url = new URL(window.location.href).toString();
    }
  } catch (error) {
    console.error('Error getting URL:', error);
    url = window.location.href;
  }

  // Use a default image URL for the favicon and apple-touch-icon when imageUrl is not provided
  const defaultImageUrl = '/images/default-favicon.png';
  const faviconUrl = imageUrl || defaultImageUrl;

  // Use a default image URL for the mask-icon when imageUrl is not provided
  const maskIconUrl = imageUrl ? `${imageUrl}/safari-pinned-tab.svg` : '/safari-pinned-tab.svg';

  // Use a default image URL for the manifest when imageUrl is not provided
  const manifestUrl = imageUrl ? `${imageUrl}/site.webmanifest` : '/site.webmanifest';

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {SEO_META_TAGS.map((tag) => (
        <meta key={tag.name} name={tag.name} content={tag.content} />
      ))}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" href={faviconUrl} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${faviconUrl}/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${faviconUrl}/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${faviconUrl}/favicon-16x16.png`}
      />
      <link rel="manifest" href={manifestUrl} />
      <link rel="mask-icon" href={maskIconUrl} color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      {/* Use aria-hidden to make the description accessible */}
      <div aria-hidden style={{ display: 'none' }}>
        {description}
      </div>
    </>
  );
};

export default MyComponent;