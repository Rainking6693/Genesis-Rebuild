import React, { PropsWithChildren } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoUrl?: string;
  message: string;
  noindex?: boolean;
  noFollow?: boolean;
}

const defaultProps: Partial<Props> = {
  seoTitle: 'Default SEO Title',
  seoDescription: 'Default SEO Description',
  noindex: false,
  noFollow: false,
};

MyComponent.defaultProps = defaultProps;

const MyComponent: React.FC<Props> = ({
  seoTitle,
  seoDescription,
  seoUrl,
  message,
  noindex,
  noFollow,
  children,
}) => {
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  const seoMetaTags = (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="robots" content={robots} />
      {seoUrl && <meta property="og:url" content={seoUrl} />}
      {children}
    </>
  );

  return (
    <div data-testid="my-component" className="my-component">
      {seoMetaTags}
      {React.createElement('div', {
        dangerouslySetInnerHTML: { __html: message },
      })}
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoUrl?: string;
  message: string;
  noindex?: boolean;
  noFollow?: boolean;
}

const defaultProps: Partial<Props> = {
  seoTitle: 'Default SEO Title',
  seoDescription: 'Default SEO Description',
  noindex: false,
  noFollow: false,
};

MyComponent.defaultProps = defaultProps;

const MyComponent: React.FC<Props> = ({
  seoTitle,
  seoDescription,
  seoUrl,
  message,
  noindex,
  noFollow,
  children,
}) => {
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  const seoMetaTags = (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="robots" content={robots} />
      {seoUrl && <meta property="og:url" content={seoUrl} />}
      {children}
    </>
  );

  return (
    <div data-testid="my-component" className="my-component">
      {seoMetaTags}
      {React.createElement('div', {
        dangerouslySetInnerHTML: { __html: message },
      })}
    </div>
  );
};

export default MyComponent;