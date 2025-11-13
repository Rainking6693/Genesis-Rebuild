import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const seoOptimizedDiv = `seo-optimized-content ${className || ''}`;

  return (
    <div className={seoOptimizedDiv} aria-label={ariaLabel}>
      <h1>{message}</h1>
      {/* Add a descriptive sentence for better SEO */}
      <p>This is a content business providing high-quality, SEO-optimized content.</p>
    </div>
  );
};

export default FunctionalComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: React.FC<Props> = ({ message, className, ariaLabel }) => {
  const seoOptimizedDiv = `seo-optimized-content ${className || ''}`;

  return (
    <div className={seoOptimizedDiv} aria-label={ariaLabel}>
      <h1>{message}</h1>
      {/* Add a descriptive sentence for better SEO */}
      <p>This is a content business providing high-quality, SEO-optimized content.</p>
    </div>
  );
};

export default FunctionalComponent;