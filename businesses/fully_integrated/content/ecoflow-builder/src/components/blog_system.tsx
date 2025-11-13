import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  children?: ReactNode; // Allows for additional elements within the component
  noindex?: boolean; // Option to noindex the page
}

const MyComponent: FC<Props> = ({ title, subtitle, content, seoTitle = title, seoDescription, children, noindex, ...rest }) => {
  const titleId = `my-component-title`;
  const subtitleId = `my-component-subtitle`;

  return (
    <div data-testid="my-component" {...rest}>
      {/* Adding aria-labels for accessibility */}
      <h1 id={titleId} aria-label={`Title: ${title}`}>
        {title}
      </h1>
      <h2 id={subtitleId} aria-label={`Subtitle: ${subtitle}`}>
        {subtitle}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {/* Adding lang attribute for SEO and accessibility */}
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription || content.slice(0, 160)} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {noindex && <meta name="robots" content="noindex" />}
      {/* Allowing for additional elements within the component */}
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  children?: ReactNode; // Allows for additional elements within the component
  noindex?: boolean; // Option to noindex the page
}

const MyComponent: FC<Props> = ({ title, subtitle, content, seoTitle = title, seoDescription, children, noindex, ...rest }) => {
  const titleId = `my-component-title`;
  const subtitleId = `my-component-subtitle`;

  return (
    <div data-testid="my-component" {...rest}>
      {/* Adding aria-labels for accessibility */}
      <h1 id={titleId} aria-label={`Title: ${title}`}>
        {title}
      </h1>
      <h2 id={subtitleId} aria-label={`Subtitle: ${subtitle}`}>
        {subtitle}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {/* Adding lang attribute for SEO and accessibility */}
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription || content.slice(0, 160)} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {noindex && <meta name="robots" content="noindex" />}
      {/* Allowing for additional elements within the component */}
      {children}
    </div>
  );
};

export default MyComponent;