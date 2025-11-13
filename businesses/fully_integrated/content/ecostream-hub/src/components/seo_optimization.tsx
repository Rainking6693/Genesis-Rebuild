import React, { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  seoTitle: string | undefined;
  seoDescription: string | undefined;
  seoImage: string | undefined;
}

interface Props extends SeoProps {
  message: string;
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, seoImage, message }) => {
  const defaultSeoTitle = 'Default Title';
  const defaultSeoDescription = 'Default Description';

  useEffect(() => {
    if (!seoTitle) seoTitle = defaultSeoTitle;
    if (!seoDescription) seoDescription = defaultSeoDescription;
  }, [seoTitle, seoDescription]);

  return (
    <>
      <Helmet>
        {/* Use unique and descriptive title for each page */}
        <title>{seoTitle}</title>
        {/* Use meta description for SEO */}
        <meta name="description" content={seoDescription} />
        {/* Use meta image for SEO */}
        {seoImage && <meta name="image" content={seoImage} />}
      </Helmet>
      <div>
        {/* Add ARIA attributes for accessibility */}
        <div role="alert">{message}</div>
      </div>
    </>
  );
};

export default MyComponent;

import React, { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  seoTitle: string | undefined;
  seoDescription: string | undefined;
  seoImage: string | undefined;
}

interface Props extends SeoProps {
  message: string;
}

const MyComponent: FC<Props> = ({ seoTitle, seoDescription, seoImage, message }) => {
  const defaultSeoTitle = 'Default Title';
  const defaultSeoDescription = 'Default Description';

  useEffect(() => {
    if (!seoTitle) seoTitle = defaultSeoTitle;
    if (!seoDescription) seoDescription = defaultSeoDescription;
  }, [seoTitle, seoDescription]);

  return (
    <>
      <Helmet>
        {/* Use unique and descriptive title for each page */}
        <title>{seoTitle}</title>
        {/* Use meta description for SEO */}
        <meta name="description" content={seoDescription} />
        {/* Use meta image for SEO */}
        {seoImage && <meta name="image" content={seoImage} />}
      </Helmet>
      <div>
        {/* Add ARIA attributes for accessibility */}
        <div role="alert">{message}</div>
      </div>
    </>
  );
};

export default MyComponent;