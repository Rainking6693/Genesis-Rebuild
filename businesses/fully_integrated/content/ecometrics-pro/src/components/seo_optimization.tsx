import React, { FC, PropsWithChildren } from 'react';

interface Props extends Omit<PropsWithChildren<any>, 'children'> {
  seoTitle?: string;
  seoDescription?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({
  seoTitle = '',
  seoDescription = '',
  children,
  className,
  ariaLabel = 'SEO Optimized Content',
  ...rest
}) => {
  const defaultClassName = 'seo-optimized-content';

  return (
    <div
      className={`${defaultClassName} ${className}`}
      data-testid="seo-optimized-content"
      {...rest}
    >
      <h1 dangerouslySetInnerHTML={{ __html: seoTitle }} />
      <div
        dangerouslySetInnerHTML={{ __html: seoDescription }}
        aria-label={ariaLabel}
      />
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, PropsWithChildren } from 'react';

interface Props extends Omit<PropsWithChildren<any>, 'children'> {
  seoTitle?: string;
  seoDescription?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({
  seoTitle = '',
  seoDescription = '',
  children,
  className,
  ariaLabel = 'SEO Optimized Content',
  ...rest
}) => {
  const defaultClassName = 'seo-optimized-content';

  return (
    <div
      className={`${defaultClassName} ${className}`}
      data-testid="seo-optimized-content"
      {...rest}
    >
      <h1 dangerouslySetInnerHTML={{ __html: seoTitle }} />
      <div
        dangerouslySetInnerHTML={{ __html: seoDescription }}
        aria-label={ariaLabel}
      />
      {children}
    </div>
  );
};

export default MyComponent;