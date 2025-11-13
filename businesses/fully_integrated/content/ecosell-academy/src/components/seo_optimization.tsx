import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
  lang?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const defaultDescription = 'Welcome to our content business';
const defaultKeywords = ['content', 'business', 'SEO'];

const MyComponent: React.FC<Props> = ({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  lang = 'en-US',
  imageUrl,
  imageAlt,
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="language" content={lang} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {imageUrl && (
          <>
            <meta property="og:url" content={`https://${window.location.host}${window.location.pathname}`} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={imageAlt || title} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content={imageAlt || title} />
          </>
        )}
      </Helmet>
      <h1 aria-level="1">Hello, {title}!</h1>
    </HelmetProvider>
  );
};

export default MyComponent;

import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
  lang?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const defaultDescription = 'Welcome to our content business';
const defaultKeywords = ['content', 'business', 'SEO'];

const MyComponent: React.FC<Props> = ({
  title,
  description = defaultDescription,
  keywords = defaultKeywords,
  lang = 'en-US',
  imageUrl,
  imageAlt,
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="language" content={lang} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {imageUrl && (
          <>
            <meta property="og:url" content={`https://${window.location.host}${window.location.pathname}`} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:alt" content={imageAlt || title} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content={imageAlt || title} />
          </>
        )}
      </Helmet>
      <h1 aria-level="1">Hello, {title}!</h1>
    </HelmetProvider>
  );
};

export default MyComponent;