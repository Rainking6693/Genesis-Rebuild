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
  ariaLabel = 'MyComponent',
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {children}
      {seoTitle && <meta name="title" content={seoTitle} />}
      {seoDescription && (
        <meta name="description" content={seoDescription} />
      )}
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
  ariaLabel = 'MyComponent',
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  return (
    <div
      className={className}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {children}
      {seoTitle && <meta name="title" content={seoTitle} />}
      {seoDescription && (
        <meta name="description" content={seoDescription} />
      )}
    </div>
  );
};

export default MyComponent;